// --- src/firebaseInit.js ---
// Purpose: Initializes Firebase and exports the auth and db instances.
// This keeps your Firebase configuration separate.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Corrected: Import getAuth
import { getFirestore } from 'firebase/firestore'; // Corrected: Import getFirestore
import { setLogLevel } from 'firebase/app'; // Corrected: Import setLogLevel

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
let authInstance; // Renamed to avoid conflict with exported 'auth'
let dbInstance;   // Renamed to avoid conflict with exported 'db'

try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app); // Corrected: Initialize auth
    dbInstance = getFirestore(app); // Corrected: Initialize db
    setLogLevel('debug'); 
    console.log("Firebase initialized successfully from firebaseInit.js.");
} catch (error) {
    console.error("Firebase initialization error in firebaseInit.js:", error);
}

// Export the initialized instances
export { app, authInstance as auth, dbInstance as db };