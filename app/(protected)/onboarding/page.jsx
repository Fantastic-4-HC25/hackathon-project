"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const lifestyleOptions = [
  "Pet-friendly",
  "Near public transport",
  "Gym nearby",
  "Quiet neighborhood",
  "Close to mall",
  "Near school/university",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [budget, setBudget] = useState("");
  const [desiredLocation, setDesiredLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [selectedLifestyles, setSelectedLifestyles] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleLifestyle = (option) => {
    setSelectedLifestyles((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);

    const ref = doc(db, "users", auth.currentUser.uid);
    await updateDoc(ref, {
      preferences: {
        budget,
        desiredLocation,
        propertyType,
        lifestyle: selectedLifestyles,
      },
      onboardingComplete: true,
      updatedAt: serverTimestamp(),
    });

    setLoading(false);
    router.replace(`/dashboard/${(await import("firebase/firestore")).getDoc(ref).then(snap => snap.data().role)}`);
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="Budget (e.g. 20000)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <Input
          placeholder="Desired Location"
          value={desiredLocation}
          onChange={(e) => setDesiredLocation(e.target.value)}
        />
        <Input
          placeholder="Property Type (e.g. condo, apartment)"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        />

        <div>
          <h2 className="font-medium mb-2">Lifestyle Preferences</h2>
          <div className="space-y-2">
            {lifestyleOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedLifestyles.includes(option)}
                  onCheckedChange={() => toggleLifestyle(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Finish Onboarding"}
        </Button>
      </form>
    </div>
  );
}
