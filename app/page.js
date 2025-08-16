"use client";

import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Find Your Perfect Rental Match
        </h1>
        <p className="text-lg text-gray-600 max-w-xl text-center mb-8">
          Whether you're a tenant looking for the ideal home or a landlord finding the right tenant, Fantastic Rental makes the process seamless and stress-free.
        </p>

        <div className="flex gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard/tenant"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/profile"
                className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  );
}
