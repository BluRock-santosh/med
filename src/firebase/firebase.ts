import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLxi5F6YAEM1yh5g8TlNRLQArrdzhBl-I",
  authDomain: "med4u-aa52f.firebaseapp.com",
  projectId: "med4u-aa52f",
  storageBucket: "med4u-aa52f.firebasestorage.app",
  messagingSenderId: "207799322712",
  appId: "1:207799322712:web:81dacce1ea3f560defa22d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
