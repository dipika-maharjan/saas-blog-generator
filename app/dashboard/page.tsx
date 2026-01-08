"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type UserData = {
  email: string;
  plan: string;
  credits: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState("");
    const [tone, setTone] = useState("professional");
    const [blogOutput, setBlogOutput] = useState("");

    const handleGenerate = () => {
  setBlogOutput(`Blog will be generated for keyword: "${keyword}"`);
};



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      setUser(currentUser);

      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setUserData(snap.data() as UserData);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

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

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">Current Plan</p>
          <p className="mt-2 text-xl font-medium capitalize">
            {userData?.plan}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">Credits Remaining</p>
          <p className="mt-2 text-xl font-medium">
            {userData?.credits}
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

        <button
          onClick={handleGenerate}
          className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Generate Blog
        </button>

        {blogOutput && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
            {blogOutput}
          </div>
        )}
      </div>
    </div>
  </div>
);
}
