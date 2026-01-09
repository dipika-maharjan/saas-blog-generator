"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { onAuthStateChanged, User } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type UserData = {
  email: string;
  plan: string;
  credits: number;
};

type Blog = {
  id: string;
  keyword: string;
  tone: string;
  content: string;
  createdAt: any;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState("professional");
  const [blogOutput, setBlogOutput] = useState("");
  const [blogHistory, setBlogHistory] = useState<Blog[]>([]);
  const [generating, setGenerating] = useState(false);

  const hasCredits = (userData?.credits ?? 0) > 0;

  // Auth + data fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      setUser(currentUser);

      // User data
      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setUserData(snap.data() as UserData);
      }

      // Blog history
      const blogsRef = collection(db, "users", currentUser.uid, "blogs");
      const q = query(blogsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setBlogHistory(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Blog[]
      );

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Blog generation
  const handleGenerate = async () => {
    if (!keyword || !user || !hasCredits) return;

    setGenerating(true);
    setBlogOutput("Generating blog...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          tone,
          uid: user.uid,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBlogOutput(data.error || "Failed to generate blog");
        return;
      }

      setBlogOutput(data.blog);

      // Optimistic UI update
      setBlogHistory((prev) => [
        {
          id: Date.now().toString(),
          keyword,
          tone,
          content: data.blog,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    } catch {
      setBlogOutput("Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.email}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Current Plan</p>
            <p className="mt-2 text-xl font-medium capitalize">
              {userData?.plan ?? "free"}
            </p>

            <button
              onClick={() => router.push("/pricing")}
              className="mt-3 rounded-lg border border-black px-3 py-1 text-sm hover:bg-black hover:text-white"
            >
              Upgrade Plan
            </button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Credits Remaining</p>
            <p className="mt-2 text-xl font-medium">
              {userData?.credits ?? 0}
            </p>
          </div>
        </div>

        {/* Blog Generator */}
        <div className="rounded-xl bg-white p-6 shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Generate Blog
          </h2>

          <input
            type="text"
            placeholder="Enter keyword (e.g. AI in healthcare)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring"
          />

          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="informative">Informative</option>
          </select>

          {!hasCredits && (
            <p className="text-sm text-red-500">
              You’ve used all your credits. Upgrade your plan to continue.
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={!keyword || generating || !hasCredits}
            className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate Blog"}
          </button>

          {blogOutput && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-line">
              {blogOutput}
            </div>
          )}
        </div>

        {/* Blog History */}
        {blogHistory.length > 0 && (
          <div className="rounded-xl bg-white p-6 shadow space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              My Blogs
            </h2>

            {blogHistory.map((b) => (
              <div key={b.id} className="border-b py-2">
                <p className="text-sm text-gray-500">
                  {b.keyword} — {b.tone}
                </p>
                <p className="mt-1 text-gray-700 whitespace-pre-line">
                  {b.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
