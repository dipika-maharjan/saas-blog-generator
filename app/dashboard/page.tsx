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

        {/* Placeholder for next step */}
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-gray-500">
          Blog generator coming next
        </div>
      </div>
    </div>
  );
}
