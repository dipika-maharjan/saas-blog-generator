import { NextResponse } from "next/server";
import OpenAI from "openai";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { keyword, tone = "professional", uid } = await req.json();

    if (!keyword || !uid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let userSnap;
    try {
      userSnap = await getDoc(doc(db, "users", uid));
    } catch (error: any) {
      return NextResponse.json(
        { error: "User verification failed", details: error?.message },
        { status: 403 }
      );
    }

    if (!userSnap.exists()) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userData = userSnap.data();

    if (!userData || userData.credits <= 0) {
      return NextResponse.json(
        { error: "Not enough credits. Upgrade your plan." },
        { status: 403 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are an expert SEO blog writer. Write clear, structured, SEO-optimized blog posts with proper headings, subheadings, and a conclusion.",
        },
        {
          role: "user",
          content: `Write a ${tone.toLowerCase()} blog post about "${keyword}". Make it at least 800 words with proper SEO optimization. Include an introduction, body sections with headers, and a conclusion.`,
        },
      ],
    });

    const blog = completion.choices?.[0]?.message?.content || "";

    if (!blog || blog.trim().length === 0) {
      return NextResponse.json(
        { error: "Failed to generate blog content. Please try again." },
        { status: 502 }
      );
    }

    await updateDoc(doc(db, "users", uid), {
      credits: userData.credits - 1,
    });

    const blogsRef = collection(db, "users", uid, "blogs");
    await addDoc(blogsRef, {
      keyword,
      tone: tone.toLowerCase(),
      content: blog,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ blog });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate blog", details: process.env.NODE_ENV === "development" ? String(error) : undefined },
      { status: 500 }
    );
  }
}
