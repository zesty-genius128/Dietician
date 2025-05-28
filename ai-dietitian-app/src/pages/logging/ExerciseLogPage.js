// --- src/pages/logging/ExerciseLogPage.js ---
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path
import { collection, addDoc, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { db as firestoreDb, firestoreAppId } from '../../firebaseInit'; // Adjusted path
import LoadingSpinner from '../../components/ui/LoadingSpinner'; // Adjusted path

const ExerciseLogPage = () => {
    const { userId } = useAuth();
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const [newLog, setNewLog] = useState({ date: new Date().toISOString().split('T')[0], exerciseType: '', duration: '', caloriesBurned: '' });
    const [loadingForm, setLoadingForm] = useState(false);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!userId) { setLoadingLogs(false); return; }
        setLoadingLogs(true);
        const exerciseLogCollectionRef = collection(firestoreDb, `artifacts/${firestoreAppId}/users/${userId}/exerciseLogs`);
        const q = query(exerciseLogCollectionRef);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            logs.sort((a, b) => (b.loggedAt?.toDate() || 0) - (a.loggedAt?.toDate() || 0)); // Sort by timestamp desc
            setExerciseLogs(logs);
            setLoadingLogs(false);
        }, (error) => {
            setMessage(`Error fetching logs: ${error.message}`); setLoadingLogs(false);
        });
        return () => unsubscribe();
    }, [userId]);
    
    const handleChange = (e) => setNewLog(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId || !newLog.exerciseType || !newLog.duration) {
            setMessage("Exercise type and duration are required."); return;
        }
        setLoadingForm(true); setMessage('');
        const exerciseLogCollectionRef = collection(firestoreDb, `artifacts/${firestoreAppId}/users/${userId}/exerciseLogs`);
        try {
            await addDoc(exerciseLogCollectionRef, { 
                ...newLog, duration: parseFloat(newLog.duration) || 0,
                caloriesBurned: parseFloat(newLog.caloriesBurned) || 0, loggedAt: Timestamp.now() 
            });
            setNewLog({ date: new Date().toISOString().split('T')[0], exerciseType: '', duration: '', caloriesBurned: '' });
            setMessage('Exercise logged successfully!');
        } catch (err) { setMessage(`Error logging exercise: ${err.message}`);}
        setLoadingForm(false); setTimeout(() => setMessage(''), 3000);
    };
    
    return (
        <div className="page-content-container">
            <div className="content-wrapper-lg">
                <h2 className="page-title">Log Your Exercise</h2>
                <p className="page-subtitle">Note: For accurate calorie burn, consider a fitness tracker. This is for manual logging.</p>
                {message && <p className={`message-box ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}
                <form onSubmit={handleSubmit} className="form-section">
                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="form-label">Date</label><input type="date" name="date" value={newLog.date} onChange={handleChange} className="input-style" required/></div>
                        <div><label className="form-label">Exercise Type</label><input type="text" name="exerciseType" value={newLog.exerciseType} onChange={handleChange} className="input-style" placeholder="e.g., Running, Weightlifting" required/></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="form-label">Duration (minutes)</label><input type="number" step="any" name="duration" value={newLog.duration} onChange={handleChange} className="input-style" placeholder="e.g., 30" required/></div>
                        <div><label className="form-label">Calories Burned (optional)</label><input type="number" step="any" name="caloriesBurned" value={newLog.caloriesBurned} onChange={handleChange} className="input-style" placeholder="kcal"/></div>
                    </div>
                    <button type="submit" disabled={loadingForm} className="btn-primary md:w-auto disabled:bg-gray-400">{loadingForm ? 'Logging...' : 'Log Exercise'}</button>
                </form>

                <h3 className="section-title">Logged Exercises</h3>
                {loadingLogs ? <LoadingSpinner /> : exerciseLogs.length === 0 ? <p className="text-gray-600 text-sm">No exercises logged yet.</p> : (
                    <div className="list-container">
                        {exerciseLogs.map(log => (
                            <div key={log.id} className="list-item">
                                <p className="font-semibold text-green-600">{log.exerciseType} - {new Date(log.date + 'T00:00:00').toLocaleDateString()}</p>
                                <p className="text-sm text-gray-700">Duration: {log.duration} mins | Calories Burned: {log.caloriesBurned || 'N/A'} kcal</p>
                                <p className="text-xs text-gray-500">Logged: {log.loggedAt?.toDate().toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default ExerciseLogPage;
