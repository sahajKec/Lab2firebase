import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration


// const firebaseConfig: FirebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
//   measurementId: "YOUR_MES_ID",
// };
const firebaseConfig = {
    apiKey: "AIzaSyBnxvrAgdXa82wpQWjFgXcb5ARF3YU3y9c",
    authDomain: "randomprojectname-833f8.firebaseapp.com",
    projectId: "randomprojectname-833f8",
    storageBucket: "randomprojectname-833f8.appspot.com",
    messagingSenderId: "821491817089",
    appId: "1:821491817089:web:e1b930e74be2d26c310b80",
    measurementId: "G-V89HPSETM6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);