"use client";

import { auth, db } from "@/lib/firebase";
import {
    onAuthStateChanged,
    deleteUser,
    updateProfile,
} from "firebase/auth";
import {
    doc,
    getDoc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const lifestyleOptions = [
    "Pet-friendly",
    "Near public transport",
    "Gym nearby",
    "Quiet neighborhood",
    "Close to mall",
    "Near school/university",
];

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState(null);
    const [editing, setEditing] = useState(false);

    // Editable tenant prefs
    const [budget, setBudget] = useState("");
    const [desiredLocation, setDesiredLocation] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [selectedLifestyles, setSelectedLifestyles] = useState([]);

    const storage = getStorage();

    // Fetch user profile
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (!u) {
                setUserData(null);
                setLoading(false);
                return;
            }

            const refDoc = doc(db, "users", u.uid);
            const snap = await getDoc(refDoc);
            if (snap.exists()) {
                const data = {
                    id: u.uid,
                    email: u.email,
                    photoURL: u.photoURL,
                    ...snap.data(),
                };
                setUserData(data);

                // preload tenant prefs if available
                if (data.role === "tenant" && data.preferences) {
                    setBudget(data.preferences.budget || "");
                    setDesiredLocation(data.preferences.desiredLocation || "");
                    setPropertyType(data.preferences.propertyType || "");
                    setSelectedLifestyles(data.preferences.lifestyle || []);
                }
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const toggleLifestyle = (option) => {
        setSelectedLifestyles((prev) =>
            prev.includes(option)
                ? prev.filter((o) => o !== option)
                : [...prev, option]
        );
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !auth.currentUser) return;

        try {
            const avatarRef = ref(storage, `avatars/${auth.currentUser.uid}`);
            await uploadBytes(avatarRef, file);
            const downloadURL = await getDownloadURL(avatarRef);

            await updateProfile(auth.currentUser, { photoURL: downloadURL });
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                photoURL: downloadURL,
            });

            setUserData((prev) => ({ ...prev, photoURL: downloadURL }));
            alert("Avatar updated!");
        } catch (error) {
            console.error("Error updating avatar:", error);
            alert("Failed to update avatar.");
        }
    };

    const handleSavePrefs = async () => {
        if (!auth.currentUser) return;

        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                preferences: {
                    budget,
                    desiredLocation,
                    propertyType,
                    lifestyle: selectedLifestyles,
                },
            });

            setUserData((prev) => ({
                ...prev,
                preferences: {
                    budget,
                    desiredLocation,
                    propertyType,
                    lifestyle: selectedLifestyles,
                },
            }));

            setEditing(false);
            alert("Preferences updated!");
        } catch (error) {
            console.error("Error updating preferences:", error);
            alert("Failed to update preferences.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!auth.currentUser) return;
        if (
            !confirm(
                "Are you sure you want to delete your account? This cannot be undone."
            )
        ) {
            return;
        }

        try {
            await deleteDoc(doc(db, "users", auth.currentUser.uid));
            await deleteUser(auth.currentUser);
            alert("Account deleted successfully.");
        } catch (error) {
            console.error("Error deleting account:", error);
            alert(
                "Failed to delete account. If it says 'requires recent login', please log out and log in again before deleting."
            );
        }
    };

    if (loading) return <div className="p-6">Loading profile...</div>;
    if (!userData) return <div className="p-6">No profile found. Please log in.</div>;

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Profile</h1>

            {/* Avatar Section */}
            <div>
                {userData.photoURL ? (
                    <img
                        src={userData.photoURL}
                        alt="User avatar"
                        className="w-24 h-24 rounded-full object-cover mb-2"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-2">
                        No Avatar
                    </div>
                )}
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>

            {/* User Info */}
            <div className="space-y-2">
                <p>
                    <strong>Email:</strong> {userData.email}
                </p>
                <p>
                    <strong>Role:</strong> {userData.role || "Not set"}
                </p>
            </div>

            {/* Tenant Preferences */}
            {userData.role === "tenant" && (
                <div className="space-y-4">
                    {!editing ? (
                        <div className="space-y-2">
                            <p>
                                <strong>Budget:</strong> {userData.preferences?.budget || "—"}
                            </p>
                            <p>
                                <strong>Desired Location:</strong>{" "}
                                {userData.preferences?.desiredLocation || "—"}
                            </p>
                            <p>
                                <strong>Property Type:</strong>{" "}
                                {userData.preferences?.propertyType || "—"}
                            </p>
                            <p>
                                <strong>Lifestyle:</strong>{" "}
                                {userData.preferences?.lifestyle?.join(", ") || "—"}
                            </p>
                            <Button onClick={() => setEditing(true)}>Edit Preferences</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Input
                                placeholder="Budget"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                            />
                            <Input
                                placeholder="Desired Location"
                                value={desiredLocation}
                                onChange={(e) => setDesiredLocation(e.target.value)}
                            />
                            <Input
                                placeholder="Property Type"
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

                            <div className="flex gap-3">
                                <Button onClick={handleSavePrefs}>Save</Button>
                                <Button variant="outline" onClick={() => setEditing(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Danger Zone */}
            <div className="mt-8 border-t border-red-300 pt-4">
                <h2 className="text-red-600 font-bold mb-2">Danger Zone</h2>
                <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    Delete My Account
                </button>
            </div>
        </div>
    );
}
