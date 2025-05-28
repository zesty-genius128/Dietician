// --- src/pages/features/RecipeSuggestionPage.js ---
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path
import { doc, onSnapshot } from 'firebase/firestore';
import { db as firestoreDb, firestoreAppId } from '../../firebaseInit'; // Adjusted path
import LoadingSpinner from '../../components/ui/LoadingSpinner'; // Adjusted path
import Modal from '../../components/ui/Modal'; // Adjusted path

const RecipeSuggestionPage = () => {
    const { userId } = useAuth();
    const [profile, setProfile] = useState(null);
    const [customPrompt, setCustomPrompt] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        if (!userId) return;
        const profileRef = doc(firestoreDb, `artifacts/${firestoreAppId}/users/${userId}/profile`, "data");
        const unsub = onSnapshot(profileRef, (docSnap) => {
            if (docSnap.exists()) setProfile(docSnap.data());
        }, (err) => setError("Could not load your profile for personalized suggestions."));
        return () => unsub();
    }, [userId]);

    const generateRecipes = async () => {
        if (!profile && !customPrompt) { setError("Please set profile preferences or enter a custom request."); return; }
        setLoading(true); setError(''); setRecipes([]);
        let promptText = "Suggest 3 healthy meal recipes. ";
        if (customPrompt) { promptText += customPrompt; }
        else if (profile) {
            promptText += `The user prefers ${profile.cuisinePreferences || 'any cuisine'} and has dietary restrictions: ${profile.dietaryRestrictions || 'none'}. `;
            promptText += `They are ${profile.age || 'an adult'} years old, with a ${profile.activityLevel || 'moderate'} activity level. `;
        }
        promptText += " For each recipe, provide recipeName (string), description (string, max 50 words), ingredients (array of strings), and instructions (array of strings). Format as a JSON array of objects.";
        
        const payload = {
            contents: [{ role: "user", parts: [{ text: promptText }] }],
            generationConfig: { responseMimeType: "application/json", 
                responseSchema: { type: "ARRAY", items: { type: "OBJECT", properties: {
                    recipeName: { type: "STRING" }, description: { type: "STRING" },
                    ingredients: { type: "ARRAY", items: { type: "STRING" } },
                    instructions: { type: "ARRAY", items: { type: "STRING" } }
                }, required: ["recipeName", "description", "ingredients", "instructions"]}}
            }
        };
        // IMPORTANT: Replace with your actual Gemini API Key or use environment variables
        const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || ""; 
        if (!GEMINI_API_KEY) {
            setError("Gemini API key is not configured. Please set REACT_APP_GEMINI_API_KEY in your .env file.");
            setLoading(false);
            return;
        }
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { const errBody = await response.text(); throw new Error(`AI API Error ${response.status}: ${errBody}`); }
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const jsonText = result.candidates[0].content.parts[0].text;
                try { setRecipes(JSON.parse(jsonText)); } 
                catch (e) { setError("Error parsing AI recipes. Raw: " + jsonText.substring(0,100)); }
            } else { setError(`No valid recipes from AI. ${result.promptFeedback?.blockReason || ''}`); }
        } catch (err) { setError(`Recipe fetch error: ${err.message}`); }
        setLoading(false);
    };
    
    const openRecipeModal = (recipe) => { setSelectedRecipe(recipe); setIsModalOpen(true); };

    return (
        <div className="page-content-container">
            <div className="content-wrapper-xl">
                <h2 className="page-title">AI Recipe Suggestions</h2>
                {error && <p className="message-box error">{error}</p>}
                <div className="prompt-section">
                    <p className="prompt-info">Get recipe ideas based on your profile or a custom request.</p>
                    {profile && (<p className="text-xs text-gray-600 mb-2">Using Profile: Cuisine: {profile.cuisinePreferences||'Any'}, Restrictions: {profile.dietaryRestrictions||'None'}</p>)}
                    <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="Or, type specific request (e.g., 'low-carb vegan dinner for one')" className="input-style w-full" rows="3"/>
                </div>
                <button onClick={generateRecipes} disabled={loading} className="btn-primary w-full md:w-auto mb-6 disabled:bg-gray-400">{loading ? 'Generating...' : 'Get Recipes'}</button>
                {loading && <LoadingSpinner />}
                {recipes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe, index) => (
                            <div key={index} className="card-item">
                                <div>
                                    <h3 className="card-title">{recipe.recipeName}</h3>
                                    <p className="card-description">{recipe.description}</p>
                                </div>
                                <button onClick={() => openRecipeModal(recipe)} className="link-style self-start mt-2">View Full Recipe &rarr;</button>
                            </div>
                        ))}
                    </div>
                )}
                 <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedRecipe?.recipeName || "Recipe"}>
                    {selectedRecipe && (<div className="space-y-3">
                        <div><h4 className="font-semibold">Description:</h4><p className="text-sm">{selectedRecipe.description}</p></div>
                        <div><h4 className="font-semibold">Ingredients:</h4><ul className="list-disc list-inside text-sm space-y-1 pl-4">{selectedRecipe.ingredients.map((ing, i)=><li key={i}>{ing}</li>)}</ul></div>
                        <div><h4 className="font-semibold">Instructions:</h4><ol className="list-decimal list-inside text-sm space-y-1 pl-4">{selectedRecipe.instructions.map((step,i)=><li key={i}>{step}</li>)}</ol></div>
                    </div>)}
                </Modal>
            </div>
        </div>
    );
};
export default RecipeSuggestionPage;
