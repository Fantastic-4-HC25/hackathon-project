// components/TenantDashboard.jsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import PropertyList from "./ListingsSection";

export default function TenantDashboard({ data }) {
    const [listings, setListings] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRec, setLoadingRec] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const listingsSnap = await getDocs(collection(db, "properties"));
            const allListings = listingsSnap.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((p) => p.status === "available");

            setListings(allListings);

            if (data) {
                try {
                    setLoadingRec(true);
                    const response = await fetch(
                        "https://openrouter.ai/api/v1/chat/completions",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                            },
                            body: JSON.stringify({
                                model: "meta-llama/llama-3.3-70b-instruct:free",
                                messages: [
                                    {
                                        role: "system",
                                        content:
                                            "You are a rental property recommendation assistant.",
                                    },
                                    {
                                        role: "user",
                                        content: `User preferences: ${JSON.stringify(
                                            data
                                        )}.
                    Available listings: ${JSON.stringify(allListings)}.
                    Recommend the top 3 listings for this user in JSON format with id and reason fields.`,
                                    },
                                ],
                                temperature: 0.7,
                            }),
                        }
                    );

                    const result = await response.json();
                    let parsed;
                    try {
                        parsed = JSON.parse(result.choices[0].message.content);
                    } catch {
                        parsed = [];
                    }
                    setRecommendations(parsed);
                } catch (err) {
                    console.error("Error fetching recommendations:", err);
                } finally {
                    setLoadingRec(false);
                }
            }
        };

        fetchData();
    }, [data]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    <strong>Budget:</strong> {data?.budget || "Not set"}
                </p>
                <p>
                    <strong>Location:</strong> {data?.desiredLocation || "Not set"}
                </p>
                <p>
                    <strong>Lifestyle:</strong> {data?.lifestyle || "Not set"}
                </p>
                <p>
                    <strong>Property Type:</strong> {data?.propertyType || "Not set"}
                </p>

                {/* Listings */}
                <div className="pt-4">
                    <h2 className="text-lg font-semibold">Available Listings</h2>
                    <PropertyList listings={listings} />
                </div>

                {/* AI Recommendations */}
                <div className="pt-4">
                    <h2 className="text-lg font-semibold">AI Recommendations</h2>
                    {loadingRec ? (
                        <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" />
                    ) : recommendations.length > 0 ? (
                        recommendations.map((rec, i) => (
                            <div key={i} className="border rounded p-2 my-2">
                                <p>
                                    <strong>Listing ID:</strong> {rec.id}
                                </p>
                                <p>
                                    <strong>Reason:</strong> {rec.reason}</p>
                            </div>
                        ))
                    ) : (
                        <p>No recommendations yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
