"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, Chrome } from "lucide-react";

export function SignupForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Onboarding + Firestore user creation
    const handleNewUser = async (user) => {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                profile: {
                    displayName: user.displayName || "",
                    avatarUrl: user.photoURL || "",
                    bio: "",
                    contact: "",
                    location: "",
                },
                role: null,
                preferences: {},
                landlordProperties: [],
                onboardingComplete: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }
        router.push("/onboarding");
    };

    // Email signup
    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await handleNewUser(user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Google signup
    const handleGoogleSignup = async () => {
        setLoading(true);
        setError("");

        try {
            const { user } = await signInWithPopup(auth, googleProvider);
            await handleNewUser(user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                    <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>
                )}

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1"
                    />
                </div>

                <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-muted px-2 text-muted-foreground">Or</span>
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignup}
                disabled={loading}
            >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
            </Button>
        </div>
    );
}
