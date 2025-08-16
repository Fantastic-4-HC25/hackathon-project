"use client";

import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-lg font-bold text-blue-700 hover:text-blue-800 transition-colors">
        <div className="bg-blue-600 text-white flex items-center justify-center rounded-md p-1 shadow-sm">
          <GalleryVerticalEnd className="size-5" />
        </div>
        Fantastic Rental
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6 text-sm font-medium">
        {user ? (
          <>
            <Link href="/dashboard/tenant" className="text-gray-700 hover:text-blue-700 transition-colors">
              Dashboard
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-blue-700 transition-colors">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-700 hover:text-blue-700 transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
