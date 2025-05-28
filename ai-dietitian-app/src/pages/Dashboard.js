// --- src/pages/DashboardPage.js ---
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Adjusted path
import { doc, collection, onSnapshot, query } from 'firebase/firestore';
import { db as firestoreDb, firestoreAppId } from '../firebaseInit'; // Adjusted path
import LoadingSpinner from '../components/ui/LoadingSpinner'; // Adjusted path

const DashboardPage = () => {
    const { userId, currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [foodLogs, setFoodLogs] = useState([]);
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!userId) { setLoadingData(false); return; }
        setLoadingData(true);
        const unsubs = [];
        const profileRef = doc(firestoreDb, `artifacts/${firestoreAppId}/users/${userId}/profile`, "data");
        unsubs.push(onSnapshot(profileRef, (docSnap) => { if (docSnap.exists()) setProfile(docSnap.data()); }, console.error));

        const commonLogQuery = (logType) => {
            const logRef = collection(firestoreDb, `artifacts/${firestoreAppId}/users/${userId}/${logType}`);
            const q = query(logRef); // No server-side ordering for simplicity
            return onSnapshot(q, (snapshot) => {
                let logs = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
                logs.sort((a, b) => (b.loggedAt?.toDate() || 0) - (a.loggedAt?.toDate() || 0)); // Client-side sort
                if (logType === 'foodLogs') setFoodLogs(logs.slice(0,5));
                else if (logType === 'exerciseLogs') setExerciseLogs(logs.slice(0,5));
            }, console.error);
        };
        unsubs.push(commonLogQuery('foodLogs'));
        unsubs.push(commonLogQuery('exerciseLogs'));
        
        const timer = setTimeout(() => setLoadingData(false), 2000); // Simplified loading indicator
        unsubs.push(() => clearTimeout(timer));
        return () => unsubs.forEach(unsub => unsub());
    }, [userId]);

    if (loadingData && (!profile && foodLogs.length === 0 && exerciseLogs.length === 0)) return <div className="p-4"><LoadingSpinner /></div>;
    if (!currentUser || !currentUser.email) return <div className="p-8 text-center text-gray-600">Please log in or sign up.</div>;
    
    const today = new Date().toISOString().split('T')[0];
    const getTodaysSum = (logs, field) => logs.filter(l => l.date === today).reduce((s, l) => s + (l[field] || 0), 0);
    const todaysCalories = getTodaysSum(foodLogs, 'calories');
    const todaysExerciseDuration = getTodaysSum(exerciseLogs, 'duration');

    return (
        <div className="page-content-container">
            <h2 className="page-title">Welcome, {profile?.displayName || currentUser?.email}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Summary Cards */}
                <div className="summary-card"><h3 className="summary-title">Today's Calories</h3><p className="summary-value">{todaysCalories.toLocaleString()} <span className="summary-unit">kcal</span></p></div>
                <div className="summary-card"><h3 className="summary-title">Today's Exercise</h3><p className="summary-value">{todaysExerciseDuration} <span className="summary-unit">mins</span></p></div>
                <div className="summary-card"><h3 className="summary-title">Profile Snippet</h3>
                    {profile ? (<ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                        <li>Wt: {profile.weight||'N/A'} kg</li><li>Fit: {profile.fitnessLevel||'N/A'}</li><li>Act: {profile.activityLevel||'N/A'}</li>
                    </ul>) : <p className="text-xs sm:text-sm text-gray-500">Update profile.</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="content-box"><h3 className="section-title">Recent Food Logs (Max 5)</h3>
                    {foodLogs.length > 0 ? (<ul className="space-y-2">{foodLogs.map(l => (<li key={l.id} className="log-item">
                        <span className="font-medium text-green-600">{l.foodName}</span> ({l.mealType}) - {l.calories} kcal
                        <span className="log-date">{new Date(l.date+'T00:00:00').toLocaleDateString()}</span></li>))}</ul>) 
                    : <p className="text-sm text-gray-500">No recent food logs.</p>}
                </div>
                <div className="content-box"><h3 className="section-title">Recent Exercise (Max 5)</h3>
                    {exerciseLogs.length > 0 ? (<ul className="space-y-2">{exerciseLogs.map(l => (<li key={l.id} className="log-item">
                        <span className="font-medium text-green-600">{l.exerciseType}</span> - {l.duration} mins
                        <span className="log-date">{new Date(l.date+'T00:00:00').toLocaleDateString()}</span></li>))}</ul>) 
                    : <p className="text-sm text-gray-500">No recent exercise logs.</p>}
                </div>
            </div>
        </div>
    );
};
export default DashboardPage;
