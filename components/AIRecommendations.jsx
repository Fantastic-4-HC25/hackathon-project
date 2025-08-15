// components/dashboard/AIRecommendations.jsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIRecommendations({ properties }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!properties || properties.length === 0) {
            setLoading(false);
            return;
        }

        const fetchAI = async () => {
            try {
                const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
                                    "You are an assistant that recommends rental properties. IMPORTANT: Only respond with a valid JSON array of objects. No extra text.",
                            },
                            {
                                role: "user",
                                content: `Here is a list of available properties: ${JSON.stringify(
                                    properties
                                )}. Recommend exactly 3 properties in the following format:\n\n[\n  { "id": "...", "title": "...", "reason": "..." },\n  { "id": "...", "title": "...", "reason": "..." },\n  { "id": "...", "title": "...", "reason": "..." }\n]`,
                            },
                        ],
                    }),
                });

                if (!res.ok) throw new Error("Failed to fetch AI recommendations");

                const data = await res.json();
                const text = data.choices?.[0]?.message?.content?.trim();

                let parsed = [];
                try {
                    parsed = JSON.parse(text); // works if AI outputs pure JSON
                } catch {
                    // fallback: try to extract JSON substring
                    const match = text.match(/\[.*\]/s);
                    if (match) {
                        parsed = JSON.parse(match[0]);
                    } else {
                        throw new Error("AI did not return valid JSON");
                    }
                }

                setRecommendations(Array.isArray(parsed) ? parsed : []);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchAI();
    }, [properties]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    Thinking of the best properties for you…
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="text-red-500">
                    Could not load recommendations: {error}
                </CardContent>
            </Card>
        );
    }

    if (recommendations.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    No recommendations available right now.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {recommendations.map((rec, idx) => (
                        <li key={rec.id || idx} className="border-b pb-2">
                            <p className="font-semibold">{rec.title}</p>
                            <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
