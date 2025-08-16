// components/chat/ChatWidget.jsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc,
    orderBy,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function ChatWidget({ conversationId, currentUser, open, onClose }) {
    const [conversations, setConversations] = useState([]);
    const [activeConvo, setActiveConvo] = useState(conversationId);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    // Fetch conversations
    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "conversations"),
            where("participants", "array-contains", currentUser.uid)
        );

        const unsub = onSnapshot(q, async (snap) => {
            const data = await Promise.all(
                snap.docs.map(async (d) => {
                    const convo = { id: d.id, ...d.data() };
                    const otherUid = convo.participants.find((p) => p !== currentUser.uid);

                    let partnerName = "Unknown";
                    if (otherUid) {
                        const userSnap = await getDoc(doc(db, "users", otherUid));
                        if (userSnap.exists()) {
                            const u = userSnap.data();
                            partnerName = u.displayName || u.email || otherUid;
                        }
                    }

                    return { ...convo, partnerName };
                })
            );

            setConversations(
                data.sort((a, b) => b.lastUpdated?.toMillis() - a.lastUpdated?.toMillis())
            );
        });

        return () => unsub();
    }, [currentUser]);

    // Load messages
    useEffect(() => {
        if (!activeConvo) return;

        const q = query(
            collection(db, "conversations", activeConvo, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsub = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });

        return () => unsub();
    }, [activeConvo]);

    // Sync prop conversationId → activeConvo
    useEffect(() => {
        if (conversationId) setActiveConvo(conversationId);
    }, [conversationId]);

    const sendMessage = async () => {
        if (!input.trim() || !activeConvo || !currentUser) return;

        await addDoc(collection(db, "conversations", activeConvo, "messages"), {
            sender: currentUser.uid,
            text: input.trim(),
            timestamp: serverTimestamp(),
        });

        setInput("");
    };

    // Collapsed button
    if (!open) {
        return (
            <button
                onClick={() => onClose(true)}
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
            >
                <MessageCircle className="w-6 h-6" />
            </button>
        );
    }

    // Expanded chat window
    return (
        <div className="fixed bottom-4 right-4 w-96 bg-white border rounded shadow-lg flex flex-col h-[500px]">
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b">
                <h2 className="font-semibold">
                    {activeConvo
                        ? conversations.find((c) => c.id === activeConvo)?.partnerName
                        : "Messages"}
                </h2>
                <Button size="sm" variant="ghost" onClick={() => onClose(false)}>
                    ✕
                </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar: list */}
                <div className="w-1/3 border-r overflow-y-auto text-sm">
                    {conversations.map((c) => (
                        <div
                            key={c.id}
                            onClick={() => setActiveConvo(c.id)}
                            className={`p-2 cursor-pointer hover:bg-gray-100 ${activeConvo === c.id ? "bg-gray-200 font-medium" : ""
                                }`}
                        >
                            <div className="truncate">{c.partnerName}</div>
                            <div className="text-xs text-gray-500 truncate">
                                {c.lastMessage || "No messages"}
                            </div>
                        </div>
                    ))}
                    {conversations.length === 0 && (
                        <p className="p-2 text-gray-500">No conversations yet</p>
                    )}
                </div>

                {/* Messages */}
                <div className="flex flex-col flex-1">
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex ${m.sender === currentUser.uid ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <span
                                    className={`px-3 py-2 rounded-lg ${m.sender === currentUser.uid
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200"
                                        }`}
                                >
                                    {m.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    {activeConvo && (
                        <div className="p-2 border-t flex">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                className="flex-1 border rounded px-2 py-1 text-sm"
                                placeholder="Type a message..."
                            />
                            <Button size="sm" className="ml-2" onClick={sendMessage}>
                                Send
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
