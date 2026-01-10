"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function HomePage() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-700">
        <div className="text-2xl font-bold text-blue-400">BlogGen AI</div>
        <div className="flex gap-4">
          {user ? (
            <>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
              >
                Dashboard
              </button>
              <button
                onClick={() => auth.signOut()}
                className="px-6 py-2 rounded-lg border border-slate-400 hover:bg-slate-700 font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/auth/login")}
                className="px-6 py-2 rounded-lg border border-slate-400 hover:bg-slate-700 font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Generate <span className="text-blue-400">SEO-Optimized Blogs</span> in Seconds
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          Harness the power of AI to create high-quality, SEO-optimized blog posts instantly. 
          Perfect for content creators, marketers, and agencies.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          {!user && (
            <>
              <button
                onClick={() => router.push("/auth/register")}
                className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={() => router.push("/pricing")}
                className="px-8 py-4 rounded-lg border-2 border-blue-400 hover:bg-slate-700 font-bold text-lg"
              >
                View Pricing
              </button>
            </>
          )}
          {user && (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-lg"
            >
              Go to Dashboard
            </button>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-slate-700/50 rounded-lg p-8 border border-slate-600">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-slate-300">Generate complete blogs in seconds, not hours.</p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-8 border border-slate-600">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">SEO Optimized</h3>
            <p className="text-slate-300">AI-powered content designed to rank higher in search engines.</p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-8 border border-slate-600">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-3">Affordable</h3>
            <p className="text-slate-300">Flexible plans for solo creators and growing teams.</p>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-slate-700/50 rounded-lg p-8 border border-slate-600">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-slate-300 mb-4">50 credits</p>
              <p className="text-3xl font-bold mb-6">$9</p>
              <button
                onClick={() => router.push(user ? "/pricing" : "/auth/register")}
                className="w-full px-6 py-2 rounded-lg border border-blue-400 hover:bg-slate-600"
              >
                Get Started
              </button>
            </div>

            <div className="bg-blue-600/30 rounded-lg p-8 border-2 border-blue-400">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-slate-300 mb-4">200 credits</p>
              <p className="text-3xl font-bold mb-6">$19</p>
              <button
                onClick={() => router.push(user ? "/pricing" : "/auth/register")}
                className="w-full px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto text-left">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
              <h4 className="font-bold text-lg mb-2">How many blogs can I generate?</h4>
              <p className="text-slate-300">Each blog generation uses 1 credit. Your plan determines how many credits you get.</p>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
              <h4 className="font-bold text-lg mb-2">Can I download my blogs?</h4>
              <p className="text-slate-300">Yes! Access all your generated blogs in the dashboard and download them anytime.</p>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
              <h4 className="font-bold text-lg mb-2">Is the content plagiarism-free?</h4>
              <p className="text-slate-300">Our AI generates original content. We recommend reviewing and personalizing as needed.</p>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
              <h4 className="font-bold text-lg mb-2">Do you offer refunds?</h4>
              <p className="text-slate-300">If you're not satisfied, contact us within 7 days for a full refund.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 text-center text-slate-400">
        <p>&copy; 2026 BlogGen AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
