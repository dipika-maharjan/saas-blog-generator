"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user] = useAuthState(auth);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        
        <p className="text-xl text-slate-300 mb-8">
          Thank you for your purchase. Your credits have been added to your account.
        </p>

        <div className="bg-slate-700/50 rounded-lg p-6 mb-8 border border-slate-600">
          <p className="text-slate-300 text-sm mb-2">Order confirmed</p>
          <p className="text-2xl font-bold text-green-400">Credits Added ✓</p>
        </div>

        <p className="text-slate-300 mb-8">
          You can now generate high-quality blog posts with your new credits. Start creating amazing content!
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-lg"
        >
          Go to Dashboard
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 px-6 py-3 rounded-lg border border-slate-400 hover:bg-slate-700 font-semibold text-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
