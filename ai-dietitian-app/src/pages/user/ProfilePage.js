// --- src/pages/user/ProfilePage.js ---
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path
import { doc, setDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db as firestoreDb, firestoreAppId } from '../../firebaseInit'; // Adjusted path
import LoadingSpinner from '../../components/ui/LoadingSpinner'; // Adjusted path

const ProfilePage = () => {
    const { userId } = useAuth();
    const [profile, setProfile] = useState({
        displayName: '', height: '', weight: '', age: '', gender: 'Prefer not to say', 
        activityLevel: 'Sedentary', fitnessLevel: 'Beginner', cuisinePreferences: '', dietaryRestrictions: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!userId) { setLoading(false); return; }
        const profileRef = doc(firestoreDb, `artifacts/${firestoreAppId}/users/${userId}/profile`, "data");
        const unsubscribe = onSnapshot(profileRef, (docSnap) => {
            if (docSnap.exists()) {
                setProfile(prev => ({ ...prev, ...docSnap.data()}));
            }
            setLoading(false);
        }, (error) => {
            setMessage(`Error fetching profile: ${error.message}`); setLoading(false);
        });
        return () => unsubscribe();
    }, [userId]);

    const handleChange = (e) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) { setMessage("User not logged in."); return; }
        const profileRef = doc(firestoreDb, `artifacts/${firestoreAppId}/users/${userId}/profile`, "data");
        setLoading(true); setMessage('');
        try {
            await setDoc(profileRef, { ...profile, updatedAt: Timestamp.now() }, { merge: true });
            setMessage('Profile updated successfully!');
        } catch (err) { setMessage(`Error updating profile: ${err.message}`); }
        setLoading(false); setTimeout(() => setMessage(''), 3000);
    };

    if (loading && !profile.displayName) return <div className="p-4"><LoadingSpinner /></div>;

    return (
        <div className="page-content-container">
            <div className="content-wrapper-md">
                <h2 className="page-title">Your Profile</h2>
                {message && <p className={`message-box ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields */}
                    <div>
                        <label className="form-label">Display Name</label>
                        <input type="text" name="displayName" value={profile.displayName || ''} onChange={handleChange} className="input-style" placeholder="Your Name"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">Height (cm)</label>
                            <input type="number" name="height" value={profile.height || ''} onChange={handleChange} className="input-style" placeholder="e.g., 175"/>
                        </div>
                        <div>
                            <label className="form-label">Weight (kg)</label>
                            <input type="number" name="weight" value={profile.weight || ''} onChange={handleChange} className="input-style" placeholder="e.g., 70"/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">Age</label>
                            <input type="number" name="age" value={profile.age || ''} onChange={handleChange} className="input-style" placeholder="e.g., 30"/>
                        </div>
                        <div>
                            <label className="form-label">Gender</label>
                            <select name="gender" value={profile.gender || 'Prefer not to say'} onChange={handleChange} className="input-style">
                                <option>Prefer not to say</option><option>Male</option><option>Female</option><option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="form-label">General Activity Level</label>
                        <select name="activityLevel" value={profile.activityLevel || 'Sedentary'} onChange={handleChange} className="input-style">
                            <option value="Sedentary">Sedentary (little/no exercise)</option>
                            <option value="LightlyActive">Lightly Active (1-3 days/wk)</option>
                            <option value="ModeratelyActive">Moderately Active (3-5 days/wk)</option>
                            <option value="VeryActive">Very Active (6-7 days/wk)</option>
                            <option value="ExtraActive">Extra Active (very hard exercise & physical job)</option>
                        </select>
                    </div>
                     <div>
                        <label className="form-label">Fitness Level (for exercise suggestions)</label>
                        <select name="fitnessLevel" value={profile.fitnessLevel || 'Beginner'} onChange={handleChange} className="input-style">
                            <option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Cuisine Preferences (comma-separated)</label>
                        <input type="text" name="cuisinePreferences" value={profile.cuisinePreferences || ''} onChange={handleChange} className="input-style" placeholder="e.g., Italian, Mexican"/>
                    </div>
                    <div>
                        <label className="form-label">Dietary Restrictions (comma-separated)</label>
                        <input type="text" name="dietaryRestrictions" value={profile.dietaryRestrictions || ''} onChange={handleChange} className="input-style" placeholder="e.g., Vegetarian, Gluten-free"/>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full disabled:bg-gray-400">
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ProfilePage;
