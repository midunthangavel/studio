
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

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
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth, db };
