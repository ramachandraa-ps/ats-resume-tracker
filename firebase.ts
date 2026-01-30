import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDDkI1SstBTlH4qz4W9Z5rwX-13a6q8v_s",
    authDomain: "ats-resume-tracker-25439.firebaseapp.com",
    projectId: "ats-resume-tracker-25439",
    storageBucket: "ats-resume-tracker-25439.firebasestorage.app",
    messagingSenderId: "286832766103",
    appId: "1:286832766103:web:832d5fc4e6de81a0400dd2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
