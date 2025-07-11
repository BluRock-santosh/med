import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const base64 = import.meta.env.VITE_FIREBASE_CONFIG_BASE64;
const firebaseConfig = JSON.parse(atob(base64));

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };


