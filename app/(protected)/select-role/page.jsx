// app/select-role/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export default function SelectRolePage() {
    const router = useRouter();

    const setRole = async (role) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        await setDoc(doc(db, "users", uid), {
            role,
            createdAt: Date.now(),
        }, { merge: true });

        router.push("/onboarding");
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <h1 className="text-2xl font-bold">Choose your role</h1>
            <div className="flex gap-4">
                <Button onClick={() => setRole("tenant")} className="w-40">Tenant</Button>
                <Button onClick={() => setRole("landlord")} className="w-40">Landlord</Button>
            </div>
        </div>
    );
}
