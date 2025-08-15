// components/dashboard/AddPropertyModal.jsx
"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AddPropertyModal({ onCreated }) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        type: "apartment",
    });

    const disabled =
        !form.title || !form.price || !form.location || !form.type || saving;

    const handleSave = async () => {
        if (!auth.currentUser) return;
        setSaving(true);

        const created = {
            ...form,
            price: Number(form.price),
            ownerId: auth.currentUser.uid,
            status: "available",
            images: [],
            features: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            __tempId: `tmp_${Date.now()}`, // for optimistic UI
        };

        // Optimistic push
        onCreated?.(created);

        try {
            await addDoc(collection(db, "properties"), created);
            setOpen(false);
            setForm({
                title: "",
                description: "",
                price: "",
                location: "",
                type: "apartment",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !saving && setOpen(v)}>
            <DialogTrigger asChild>
                <Button>Add Property</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <Input
                        placeholder="Title"
                        value={form.title}
                        onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                    />
                    <Textarea
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                    />
                    <Input
                        type="number"
                        placeholder="Price (e.g. 20000)"
                        value={form.price}
                        onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                    />
                    <Input
                        placeholder="Location (e.g. Makati)"
                        value={form.location}
                        onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
                    />
                    <Input
                        placeholder="Type (e.g. condo, apartment)"
                        value={form.type}
                        onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
                    />
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={disabled}>
                        {saving ? "Saving…" : "Save Property"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
