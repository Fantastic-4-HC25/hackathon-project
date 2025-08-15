"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Chrome } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Unified onboarding check
  const checkOnboarding = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      // Create doc for brand new account
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
      return router.push("/onboarding");
    }

    const data = snap.data();

    // If onboarding not done, force them there
    if (!data.onboardingComplete) {
      return router.push("/onboarding");
    }

    // Otherwise, go to dashboard by role
    return router.push(`/dashboard/${data.role || ""}`);
  };


  // Email login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await checkOnboarding(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await checkOnboarding(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleLogin} className="space-y-4">
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Mail className="mr-2 h-4 w-4" />
          Log In
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
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <Chrome className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
    </div>
  );
}
