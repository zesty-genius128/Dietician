// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVImHbmoYlBZX-efO34k9TuqL_X9Env9g",
  authDomain: "dietician-bc3fe.firebaseapp.com",
  projectId: "dietician-bc3fe",
  storageBucket: "dietician-bc3fe.firebasestorage.app",
  messagingSenderId: "359776875549",
  appId: "1:359776875549:web:b0924ba9f9870493df82f4",
  measurementId: "G-EEJFC39W9M"
};

// This appId is used for namespacing in Firestore paths.
// You can keep it or change it, just be consistent.
export const firestoreAppId = 'default-dietitian-app-enhanced';

let app;
let auth;
let db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    setLogLevel('debug'); // Or 'silent' for production
    console.log("Firebase initialized successfully from firebaseInit.js.");
} catch (error) {
    console.error("Firebase initialization error in firebaseInit.js:", error);
    // In a real app, you might want to display an error to the user here
    // or have a fallback mechanism.
}

export { app, auth, db };