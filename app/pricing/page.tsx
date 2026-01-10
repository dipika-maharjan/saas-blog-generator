"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

const starterPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || "price_123";
const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "price_456";

const plans = [
  {
    name: "Starter",
    price: "$9",
    priceId: starterPriceId,
    credits: 50,
  },
  {
    name: "Pro",
    price: "$19",
    priceId: proPriceId,
    credits: 200,
  },
];

export default function PricingPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const checkout = async (priceId: string) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId,
        uid: user?.uid,
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to initiate checkout");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
          <p className="mt-2 text-lg text-gray-600">Choose the plan that fits your needs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((p) => (
            <div key={p.name} className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900">{p.name}</h2>
              <p className="mt-2 text-gray-600">{p.credits} credits</p>
              <p className="my-6 text-4xl font-bold text-gray-900">{p.price}<span className="text-lg text-gray-500">/one-time</span></p>
              
              <ul className="space-y-3 mb-8 text-sm text-gray-700">
                <li>✓ {p.credits} blog generations</li>
                <li>✓ SEO-optimized content</li>
                <li>✓ Multiple tones (Professional, Casual, Informative)</li>
              </ul>

              <button
                onClick={() => checkout(p.priceId)}
                className={`w-full rounded-lg py-3 text-white font-semibold transition ${
                  user
                    ? "bg-black hover:bg-gray-800"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!user}
              >
                {user ? "Choose Plan" : "Sign in to upgrade"}
              </button>
            </div>
          ))}
        </div>

        {!user && (
          <div className="mt-12 rounded-lg bg-blue-50 p-6 text-center">
            <p className="text-gray-700 mb-4">
              Already have an account?
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
