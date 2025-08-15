// app/dashboard/[role]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import AddPropertyModal from "@/components/AddPropertyModal";
import ListingsSection from "@/components/ListingsSection";
import AIRecommendations from "@/components/AIRecommendations";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const params = useParams();
    const role = params?.role; // dynamic role from URL
    const router = useRouter();

    const [userData, setUserData] = useState(null);
    const [listings, setListings] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingListings, setLoadingListings] = useState(true);

    // Get logged-in user and ensure correct role route
    useEffect(() => {
        const run = async () => {
            const user = auth.currentUser;
            if (!user) return router.replace("/login");

            const snap = await getDoc(doc(db, "users", user.uid));
            if (!snap.exists()) return router.replace("/select-role");

            const data = { id: user.uid, email: user.email, ...snap.data() };

            // Normalize route if mismatch
            if (data.role && data.role !== role) {
                return router.replace(`/dashboard/${data.role}`);
            }

            setUserData(data);
            setLoadingUser(false);
        };

        run();
    }, [role, router]);

    // Realtime "available" listings
    useEffect(() => {
        const q = query(collection(db, "properties"), where("status", "==", "available"));
        const unsub = onSnapshot(
            q,
            (snap) => {
                setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
                setLoadingListings(false);
            },
            () => setLoadingListings(false)
        );
        return () => unsub();
    }, []);

    if (loadingUser) {
        return (
            <div className="flex items-center justify-center h-screen text-muted-foreground">
                Loading dashboard…
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Welcome, {userData?.role}</h1>
                <Button onClick={() => router.push(`/profile/${auth.currentUser.uid}`)}>
                    View My Profile
                </Button>
            </div>

            {/* Tenant-only: AI recommendations */}
            {userData?.role === "tenant" && (
                <AIRecommendations properties={listings} />
            )}

            {/* Landlord-only: add property modal */}
            {userData?.role === "landlord" && (
                <div className="flex justify-end">
                    <AddPropertyModal
                        onCreated={(created) => {
                            // Optimistic update while waiting for onSnapshot
                            setListings((prev) => [
                                { ...created, id: created.__tempId || Math.random().toString(36).slice(2) },
                                ...prev,
                            ]);
                        }}
                    />
                </div>
            )}

            {/* Shared: property listings */}
            <ListingsSection listings={listings} loading={loadingListings} />
        </div>
    );
}
