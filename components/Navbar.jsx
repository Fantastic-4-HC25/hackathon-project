"use client";

import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

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
        <nav className="w-full flex items-center justify-between px-6 py-4 border-b">
            <Link href="/" className="text-lg font-bold">
                🏠 RentMatch
            </Link>
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link href="/dashboard/tenant" className="hover:underline">
                            Dashboard
                        </Link>
                        <Link href="/profile" className="hover:underline">
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 hover:underline"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="hover:underline">
                            Login
                        </Link>
                        <Link href="/signup" className="hover:underline">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
