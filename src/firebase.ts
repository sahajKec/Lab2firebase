import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


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
    apiKey: "AIzaSyAHzS6aZpLOlrojPwRr3RDsoYYiosCWgaU",
    authDomain: "bctlogin-dbb37.firebaseapp.com",
    projectId: "bctlogin-dbb37",
    storageBucket: "bctlogin-dbb37.appspot.com",
    messagingSenderId: "535728973924",
    appId: "1:535728973924:web:267868810d6c65e06c9771"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
