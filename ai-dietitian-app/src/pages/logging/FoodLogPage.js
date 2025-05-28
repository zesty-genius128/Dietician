import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path
import { collection, addDoc, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { db as firestoreDb, firestoreAppId } from '../../firebaseInit'; // Adjusted path
import LoadingSpinner from '../../components/ui/LoadingSpinner'; // Adjusted path

const FoodLogPage = () => {
    const { userId } = useAuth();
    const [foodItems, setFoodItems] = useState([]);
    const [newItem, setNewItem] = useState({ date: new Date().toISOString().split('T')[0], mealType: 'Breakfast', foodName: '', calories: '', protein: '', carbs: '', fat: '' });
    const [loadingForm, setLoadingForm] = useState(false);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!userId) { setLoadingLogs(false); return; }
        setLoadingLogs(true);
        const foodLogCollectionRef = collection(firestoreDb, `artifacts/${firestoreAppId}/users/${userId}/foodLogs`);
        const q = query(foodLogCollectionRef);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            logs.sort((a, b) => (b.loggedAt?.toDate() || 0) - (a.loggedAt?.toDate() || 0)); // Sort by timestamp desc
            setFoodItems(logs);
            setLoadingLogs(false);
        }, (error) => {
            setMessage(`Error fetching logs: ${error.message}`); setLoadingLogs(false);
        });
        return () => unsubscribe();
    }, [userId]);

    const handleChange = (e) => setNewItem(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId || !newItem.foodName || !newItem.calories) {
            setMessage("Food name and calories are required."); return;
        }
        setLoadingForm(true); setMessage('');
        const foodLogCollectionRef = collection(firestoreDb, `artifacts/${firestoreAppId}/users/${userId}/foodLogs`);
        try {
            await addDoc(foodLogCollectionRef, { 
                ...newItem, 
                calories: parseFloat(newItem.calories) || 0, protein: parseFloat(newItem.protein) || 0,
                carbs: parseFloat(newItem.carbs) || 0, fat: parseFloat(newItem.fat) || 0,
                loggedAt: Timestamp.now() 
            });
            setNewItem({ date: new Date().toISOString().split('T')[0], mealType: 'Breakfast', foodName: '', calories: '', protein: '', carbs: '', fat: '' });
            setMessage('Food item logged successfully!');
        } catch (err) { setMessage(`Error logging food: ${err.message}`); }
        setLoadingForm(false); setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="page-content-container">
            <div className="content-wrapper-lg">
                <h2 className="page-title">Log Your Food</h2>
                {message && <p className={`message-box ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}
                <form onSubmit={handleSubmit} className="form-section">
                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="form-label">Date</label><input type="date" name="date" value={newItem.date} onChange={handleChange} className="input-style" required/></div>
                        <div><label className="form-label">Meal Type</label><select name="mealType" value={newItem.mealType} onChange={handleChange} className="input-style"><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></div>
                    </div>
                    <div><label className="form-label">Food Name / Description</label><input type="text" name="foodName" value={newItem.foodName} onChange={handleChange} className="input-style" placeholder="e.g., Apple, Chicken Salad" required/></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div><label className="form-label">Calories</label><input type="number" step="any" name="calories" value={newItem.calories} onChange={handleChange} className="input-style" placeholder="kcal" required/></div>
                        <div><label className="form-label">Protein (g)</label><input type="number" step="any" name="protein" value={newItem.protein} onChange={handleChange} className="input-style" placeholder="grams"/></div>
                        <div><label className="form-label">Carbs (g)</label><input type="number" step="any" name="carbs" value={newItem.carbs} onChange={handleChange} className="input-style" placeholder="grams"/></div>
                        <div><label className="form-label">Fat (g)</label><input type="number" step="any" name="fat" value={newItem.fat} onChange={handleChange} className="input-style" placeholder="grams"/></div>
                    </div>
                    <button type="submit" disabled={loadingForm} className="btn-primary md:w-auto disabled:bg-gray-400">{loadingForm ? 'Logging...' : 'Log Food Item'}</button>
                </form>

                <h3 className="section-title">Logged Items</h3>
                {loadingLogs ? <LoadingSpinner /> : foodItems.length === 0 ? <p className="text-gray-600 text-sm">No food items logged yet.</p> : (
                    <div className="list-container">
                        {foodItems.map(item => (
                            <div key={item.id} className="list-item">
                                <p className="font-semibold text-green-600">{item.foodName} ({item.mealType}) - {new Date(item.date + 'T00:00:00').toLocaleDateString()}</p>
                                <p className="text-sm text-gray-700">Cal: {item.calories||0} | P: {item.protein||0}g | C: {item.carbs||0}g | F: {item.fat||0}g</p>
                                <p className="text-xs text-gray-500">Logged: {item.loggedAt?.toDate().toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default FoodLogPage;
