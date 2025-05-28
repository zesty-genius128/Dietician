import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
    signInAnonymously, 
    signInWithCustomToken, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth as firebaseAuth, db as firestoreDb, firestoreAppId } from '../firebaseInit'; // Use aliased imports

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (!firebaseAuth) {
            console.error("Firebase Auth is not initialized (AuthContext).");
            setLoadingAuth(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                setCurrentUser(user);
                setUserId(user.uid);
                const userProfileRef = doc(firestoreDb, `artifacts/${firestoreAppId}/users/${user.uid}/profile`, "data");
                const docSnap = await getDoc(userProfileRef);
                if (!docSnap.exists() && user.email) { 
                    try {
                        await setDoc(userProfileRef, {
                            createdAt: Timestamp.now(),
                            email: user.email,
                            displayName: user.displayName || user.email?.split('@')[0] || "User",
                            fitnessLevel: "Beginner",
                        });
                    } catch (e) {
                        console.error("Error creating user profile (AuthContext):", e);
                    }
                }
            } else {
                setCurrentUser(null);
                setUserId(null);
                // Attempt anonymous sign-in if no user. 
                // Remove __initial_auth_token logic if not applicable to your setup.
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { // This is more for specific environments like Canvas
                    try {
                        await signInWithCustomToken(firebaseAuth, __initial_auth_token);
                    } catch (error) {
                        try { await signInAnonymously(firebaseAuth); } catch (e) { console.error("Anonymous sign-in failed (AuthContext)", e); }
                    }
                } else {
                    try { await signInAnonymously(firebaseAuth); } catch (e) { console.error("Anonymous sign-in failed (AuthContext)", e); }
                }
            }
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const appSignUp = async (email, password) => {
        if (!firebaseAuth) throw new Error("Auth not initialized (AuthContext)");
        return createUserWithEmailAndPassword(firebaseAuth, email, password);
    };

    const appLogin = async (email, password) => {
        if (!firebaseAuth) throw new Error("Auth not initialized (AuthContext)");
        return signInWithEmailAndPassword(firebaseAuth, email, password);
    };

    const appSignOut = async () => {
        if (!firebaseAuth) throw new Error("Auth not initialized (AuthContext)");
        await signOut(firebaseAuth);
        try { await signInAnonymously(firebaseAuth); } catch (e) { console.error("Anonymous sign-in post-logout failed (AuthContext)", e); }
    };

    return (
        <AuthContext.Provider value={{ currentUser, userId, loadingAuth, appSignUp, appLogin, appSignOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
