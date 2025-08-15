// app/(protected)/dashboard/[role]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { role } = useParams();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const snap = await getDoc(doc(db, "users", user.uid));
            if (!snap.exists()) return;

            const data = snap.data();
            if (data.role !== role) {
                router.replace(`/dashboard/${data.role}`);
                return;
            }
            setUserData(data);
            setLoading(false);
        };

        fetchData();
    }, [role, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Welcome, {userData.role}</h1>

            {role === "tenant" ? (
                <TenantDashboard data={userData.preferences} />
            ) : (
                <LandlordDashboard data={userData.landlordProperties} />
            )}

            <div className="pt-6">
                <Button onClick={() => router.push("/settings")}>Go to Settings</Button>
            </div>
        </div>
    );
}

function TenantDashboard({ data }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Preferences</CardTitle>
            </CardHeader>
            <CardContent>
                <p><strong>Budget:</strong> {data?.budget || "Not set"}</p>
                <p><strong>Location:</strong> {data?.desiredLocation || "Not set"}</p>
                <p><strong>Lifestyle:</strong> {data?.lifestyle || "Not set"}</p>
                <p><strong>Property Type:</strong> {data?.propertyType || "Not set"}</p>
            </CardContent>
        </Card>
    );
}

function LandlordDashboard({ data }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Properties</CardTitle>
            </CardHeader>
            <CardContent>
                {Array.isArray(data) && data.length > 0
                    ? data.map((p, i) => (
                        <div key={i} className="border-b py-2">
                            <p><strong>Location:</strong> {p.propertyLocation}</p>
                            <p><strong>Type:</strong> {p.propertyType}</p>
                        </div>
                    ))
                    : <p>No properties yet.</p>}
            </CardContent>
        </Card>
    );
}
