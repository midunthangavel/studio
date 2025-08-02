
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "venuevoyager-kga4a",
  "appId": "1:70267555311:web:fbd31ed89884df503afa1a",
  "storageBucket": "venuevoyager-kga4a.firebasestorage.app",
  "apiKey": "AIzaSyBuMLekGEy4GKRE-Jw-I6jc1uGgEFMThG8",
  "authDomain": "venuevoyager-kga4a.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "70267555311"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
