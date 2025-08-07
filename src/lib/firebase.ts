
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "venuevoyager-kga4a",
  "appId": "1:70267555311:web:fbd31ed89884df503afa1a",
  "storageBucket": "venuevoyager-kga4a.firebasestorage.app",
  "apiKey": "AIzaSyBuMLekGEy4GKRE-Jw-I6jc1uGgEFMThG8",
  "authDomain": "venuevoyager-kga4a.firebaseapp.com",
  "measurementId": "G-11V622151G",
  "messagingSenderId": "70267555311"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
