"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const PUBLIC_PATHS = ["/login", "/signup"];

export default function AuthGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [booting, setBooting] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            // If user is NOT logged in
            if (!user) {
                if (!PUBLIC_PATHS.includes(pathname)) {
                    router.replace("/login");
                }
                setBooting(false);
                return;
            }

            // User is logged in — fetch profile
            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);
            const role = snap.data()?.role || null;
            const hasOnboarding = !!snap.data()?.preferences || !!snap.data()?.profile;

            // Handle logged-in but missing role
            if (!role && pathname !== "/select-role") {
                router.replace("/select-role");
                setBooting(false);
                return;
            }

            // Handle logged-in but missing onboarding
            if (role && !hasOnboarding && pathname !== "/onboarding") {
                router.replace("/onboarding");
                setBooting(false);
                return;
            }

            // Handle logged-in and fully onboarded
            if (PUBLIC_PATHS.includes(pathname)) {
                router.replace(`/dashboard/${role}`);
                setBooting(false);
                return;
            }

            setBooting(false);
        });

        return () => unsub();
    }, [pathname, router]);

    if (booting) {
        return (
            <div className="flex items-center justify-center h-screen text-sm">
                Loading...
            </div>
        );
    }

    return children;
}
