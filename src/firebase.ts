import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSy.....................",
  authDomain: "lab-auth-demo.firebaseapp.com",
  projectId: "lab-auth-demo",
  storageBucket: "lab-auth-demo.firebasestorage.app",
  messagingSenderId: "1076101834499",
  appId: "1:1076101834499:web:72ceeb46d6c86303f0ab36"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
