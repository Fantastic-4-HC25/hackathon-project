// app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function DashboardRoot() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.replace("/login");
                return;
            }

            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                const role = snap.data().role;
                if (role) {
                    router.replace(`/dashboard/${role}`);
                } else {
                    router.replace("/select-role");
                }
            } else {
                router.replace("/select-role");
            }
            setLoading(false);
        });

        return () => unsub();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-sm">
                Redirecting...
            </div>
        );
    }

    return null;
}
