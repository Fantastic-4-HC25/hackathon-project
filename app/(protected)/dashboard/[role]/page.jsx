"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    serverTimestamp,
    getDocs,
} from "firebase/firestore";
import AddPropertyModal from "@/components/AddPropertyModal";
import ListingsSection from "@/components/ListingsSection";
import AIRecommendations from "@/components/AIRecommendations";
import ChatWidget from "@/components/chat/ChatWidget";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const params = useParams();
    const role = params?.role;
    const router = useRouter();

    const [userData, setUserData] = useState(null);
    const [listings, setListings] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingListings, setLoadingListings] = useState(true);

    const [chatOpen, setChatOpen] = useState(true); // always open
    const [conversationId, setConversationId] = useState(null);

    // Get logged-in user
    useEffect(() => {
        const run = async () => {
            const user = auth.currentUser;
            if (!user) return router.replace("/login");

            const snap = await getDoc(doc(db, "users", user.uid));
            if (!snap.exists()) return router.replace("/select-role");

            const data = { id: user.uid, email: user.email, ...snap.data() };

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

    // Open chat with owner of a property
    const handleChat = async (property) => {
        const user = auth.currentUser;
        if (!user || !property?.ownerId) return;

        const convosRef = collection(db, "conversations");

        // Find if convo already exists
        const q = query(convosRef, where("participants", "array-contains", user.uid));
        const snapshot = await getDocs(q);

        let existingConvo = null;
        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.participants.includes(property.ownerId)) {
                existingConvo = { id: docSnap.id, ...data };
            }
        });

        if (existingConvo) {
            setConversationId(existingConvo.id);
        } else {
            const newConvo = await addDoc(convosRef, {
                participants: [user.uid, property.ownerId],
                lastMessage: "",
                lastUpdated: serverTimestamp(),
            });
            setConversationId(newConvo.id);
        }

        setChatOpen(true);
    };

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
                <Button onClick={() => router.push(`/profile`)}>View My Profile</Button>
            </div>

            {userData?.role === "tenant" && <AIRecommendations properties={listings} />}

            {userData?.role === "landlord" && (
                <div className="flex justify-end">
                    <AddPropertyModal
                        onCreated={(created) => {
                            setListings((prev) => [
                                { ...created, id: created.__tempId || Math.random().toString(36).slice(2) },
                                ...prev,
                            ]);
                        }}
                    />
                </div>
            )}

            <ListingsSection
                listings={listings}
                loading={loadingListings}
                onChat={handleChat} // tenants open chat
            />

            {/* ✅ Chat widget now includes history + messages */}
            <ChatWidget
                conversationId={conversationId}
                open={chatOpen}
                onClose={setChatOpen}  
                currentUser={auth.currentUser}
            />
        </div>
    );
}
