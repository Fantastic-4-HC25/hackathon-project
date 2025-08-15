// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDyz4g4gzMopBwuBYNzT4srbLmWEAiTung",
    authDomain: "hackercup-ce88c.firebaseapp.com",
    projectId: "hackercup-ce88c",
    storageBucket: "hackercup-ce88c.firebasestorage.app",
    messagingSenderId: "847149308340",
    appId: "1:847149308340:web:c0523875bac394077ffae1",
    measurementId: "G-WEEGV9BMYW"
};


// Avoid re-initializing during hot reloads
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Google provider (prompt account selection)
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Db
export const db = getFirestore(app);