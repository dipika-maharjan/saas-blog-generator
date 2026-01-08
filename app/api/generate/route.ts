import { NextResponse } from "next/server";
import OpenAI from "openai";

import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { keyword, tone, uid } = await req.json();

    if (!keyword || !uid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Fetch user data
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userData = userSnap.data();

    // 2. Check credits
    if (userData.credits <= 0) {
      return NextResponse.json(
        { error: "Not enough credits" },
        { status: 403 }
      );
    }

    // 3. Generate blog with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert SEO blog writer. Write clear, structured, SEO-optimized blogs.",
        },
        {
          role: "user",
          content: `Write a ${tone} blog post about "${keyword}". Include headings and a conclusion.`,
        },
      ],
    });

    const blog = completion.choices[0].message.content;

    // 4. Deduct 1 credit
    await updateDoc(userRef, {
      credits: userData.credits - 1,
    });

    // 5. Return blog
    return NextResponse.json({ blog });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
