import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not configured");
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    const { priceId, uid } = await req.json();

    if (!priceId || !uid) {
      return NextResponse.json(
        { error: "Missing priceId or uid" },
        { status: 400 }
      );
    }

    if (typeof priceId !== "string" || typeof uid !== "string") {
      return NextResponse.json(
        { error: "Invalid priceId or uid format" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    console.log(`Creating checkout session for user ${uid} with price ${priceId}`);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/pricing`,
      metadata: {
        uid,
        priceId,
      },
    });

    if (!session.url) {
      console.error("Stripe session created but no URL returned");
      return NextResponse.json(
        { error: "Unable to create checkout session" },
        { status: 500 }
      );
    }

    console.log(`Checkout session created: ${session.id}`);
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error?.message);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: error?.message },
      { status: 500 }
    );
  }
}
