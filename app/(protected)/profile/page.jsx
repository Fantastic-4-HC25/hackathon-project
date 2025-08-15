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

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState(null);
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
                setUserData({
                    id: u.uid,
                    email: u.email,
                    photoURL: u.photoURL,
                    ...snap.data(),
                });
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !auth.currentUser) return;

        try {
            // Upload to Firebase Storage
            const avatarRef = ref(storage, `avatars/${auth.currentUser.uid}`);
            await uploadBytes(avatarRef, file);

            // Get download URL
            const downloadURL = await getDownloadURL(avatarRef);

            // Update Firebase Auth profile
            await updateProfile(auth.currentUser, { photoURL: downloadURL });

            // Update Firestore user doc
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                photoURL: downloadURL,
            });

            // Update local state
            setUserData((prev) => ({ ...prev, photoURL: downloadURL }));
            alert("Avatar updated!");
        } catch (error) {
            console.error("Error updating avatar:", error);
            alert("Failed to update avatar.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!auth.currentUser) return;
        if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            return;
        }

        try {
            // Delete Firestore data
            await deleteDoc(doc(db, "users", auth.currentUser.uid));

            // Delete Auth user
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
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>

            {/* Avatar Section */}
            <div className="mb-4">
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
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block"
                />
            </div>

            {/* User Info */}
            <div className="space-y-2">
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Role:</strong> {userData.role || "Not set"}</p>
                {userData.preferences && (
                    <>
                        <p><strong>Budget:</strong> {userData.preferences.budget}</p>
                        <p><strong>Desired Location:</strong> {userData.preferences.desiredLocation}</p>
                        <p><strong>Property Type:</strong> {userData.preferences.propertyType}</p>
                        <p><strong>Lifestyle:</strong> {userData.preferences.lifestyle?.join(", ")}</p>
                    </>
                )}
            </div>

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
