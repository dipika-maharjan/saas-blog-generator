import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err?.message);
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const uid = session.metadata?.uid;
      const priceId = session.metadata?.priceId;

      if (!uid || !priceId) {
        console.warn("Webhook received without uid or priceId");
        return NextResponse.json({ received: true });
      }

      const STARTER_PRICE = process.env.STRIPE_PRICE_STARTER;
      const PRO_PRICE = process.env.STRIPE_PRICE_PRO;

      const credits =
        priceId === STARTER_PRICE ? 50 :
        priceId === PRO_PRICE ? 200 : 0;

      console.log(`Processing payment for user ${uid}, adding ${credits} credits`);

      try {
        await updateDoc(doc(db, "users", uid), {
          plan: priceId === PRO_PRICE ? "pro" : "starter",
          credits: increment(credits),
          updatedAt: new Date(),
        });
        console.log(`Successfully updated user ${uid} with ${credits} credits`);
      } catch (firestoreError: any) {
        console.error(`Failed to update user ${uid}:`, firestoreError?.message);
        return NextResponse.json(
          { error: "Failed to process payment" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error?.message);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
