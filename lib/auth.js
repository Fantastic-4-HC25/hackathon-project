// lib/auth.js
import { auth, googleProvider, db } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function signUpEmail(email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), { createdAt: Date.now() });
}

export async function loginEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function loginGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    const ref = doc(db, "users", cred.user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        await setDoc(ref, { createdAt: Date.now() });
    }
}

export function logout() {
    return signOut(auth);
}
