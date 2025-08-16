"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

export default function ListingsSection({ listings, loading, onChat }) {
    const currentUser = auth.currentUser;

    if (loading) return <p>Loading properties…</p>;
    if (!listings || listings.length === 0) return <p>No available properties.</p>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-3">Available Listings</h2>
            <div className="grid gap-4 sm:grid-cols-2">
                {listings.map((p) => (
                    <article
                        key={p.id}
                        className="border rounded-lg p-4 bg-background flex flex-col"
                    >
                        <h3 className="font-semibold">{p.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {p.description}
                        </p>
                        <div className="mt-2 text-sm">
                            <div><strong>Type:</strong> {p.type}</div>
                            <div><strong>Location:</strong> {p.location}</div>
                            <div>
                                <strong>Price:</strong> ₱{Number(p.price || 0).toLocaleString()}
                            </div>
                            {Array.isArray(p.features) && p.features.length > 0 && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    <strong>Features:</strong> {p.features.join(", ")}
                                </div>
                            )}
                        </div>

                        {currentUser && p.ownerId !== currentUser.uid && (
                            <div className="mt-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onChat?.(p)}
                                >
                                    Chat with Owner
                                </Button>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
}
