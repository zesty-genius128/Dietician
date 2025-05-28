// --- src/pages/features/ExerciseGuidePage.js ---
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; 
import { doc, onSnapshot } from 'firebase/firestore';
import { db as firestoreDb, firestoreAppId } from '../../firebaseInit'; 
import LoadingSpinner from '../../components/ui/LoadingSpinner'; 
import Modal from '../../components/ui/Modal'; 

const muscleGroupOptions = [
    "Full Body", "Legs", "Chest", "Back", "Shoulders", 
    "Biceps", "Triceps", "Abs/Core"
];

const ExerciseGuidePage = () => {
    const { userId } = useAuth();
    const [profileFitnessLevel, setProfileFitnessLevel] = useState('Beginner');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(muscleGroupOptions[0]); // Default to "Full Body"
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);

    useEffect(() => {
        if (!userId) { 
            if (!selectedLevel) setSelectedLevel('Beginner'); 
            return; 
        }
        const profileRef = doc(firestoreDb, `artifacts/${firestoreAppId}/users/${userId}/profile`, "data");
        const unsub = onSnapshot(profileRef, (docSnap) => {
            if (docSnap.exists()) {
                const level = docSnap.data().fitnessLevel || 'Beginner';
                setProfileFitnessLevel(level);
                if (!selectedLevel) setSelectedLevel(level); 
            } else { if (!selectedLevel) setSelectedLevel('Beginner'); }
        }, () => { setError("Could not load profile fitness level."); if (!selectedLevel) setSelectedLevel('Beginner');});
        return () => unsub();
    }, [userId, selectedLevel]); 

    const generateExercises = async () => {
        if (!selectedLevel) { setError("Please select a fitness level."); return; }
        if (!selectedMuscleGroup) { setError("Please select a target muscle group."); return; }

        setLoading(true); setError(''); setExercises([]);
        let promptText = `Suggest 3-5 suitable exercises for a ${selectedLevel} fitness level, specifically targeting the ${selectedMuscleGroup}. `;
        promptText += "For each exercise: provide its exerciseName (string), a brief description (string, max 30 words), and detailed instructions (array of strings, detailing steps & common mistakes to avoid). Format as JSON array of objects.";
        
        const payload = {
            contents: [{role:"user", parts:[{text:promptText}]}],
            generationConfig: {responseMimeType:"application/json",
                responseSchema: {type:"ARRAY",items:{type:"OBJECT",properties:{
                    exerciseName:{type:"STRING"},description:{type:"STRING"},
                    instructions:{type:"ARRAY",items:{type:"STRING"}}
                }, required:["exerciseName","description","instructions"]}}
            }
        };
        const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || ""; 
         if (!GEMINI_API_KEY) {
            setError("Gemini API key is not configured. Please set REACT_APP_GEMINI_API_KEY in your .env file.");
            setLoading(false);
            return;
        }
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        try {
            const response = await fetch(apiUrl, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
            if(!response.ok){const errBody=await response.text();throw new Error(`AI API Error ${response.status}: ${errBody}`);}
            const result = await response.json();
            if(result.candidates?.[0]?.content?.parts?.[0]?.text){
                const jsonText = result.candidates[0].content.parts[0].text;
                try { setExercises(JSON.parse(jsonText)); }
                catch(e) { setError("Error parsing AI exercises. Raw: " + jsonText.substring(0,100));}
            } else { setError(`No valid exercises from AI. ${result.promptFeedback?.blockReason ? `Reason: ${result.promptFeedback.blockReason}` : ''}`); }
        } catch (err) { setError(`Exercise fetch error: ${err.message}`); }
        setLoading(false);
    };

    const openExerciseModal = (exercise) => { setSelectedExercise(exercise); setIsModalOpen(true); };
    
    return (
        <div className="page-content-container">
            <div className="content-wrapper-xl">
                <h2 className="page-title">AI Exercise Guide</h2>
                <p className="page-subtitle">Select fitness level and target muscle group for suggestions. Consult a pro before starting.</p>
                {error && <p className="message-box error">{error}</p>}
                
                <div className="prompt-section flex flex-col sm:flex-row items-start sm:items-end gap-4">
                    <div className="flex-grow w-full sm:w-auto">
                        <label htmlFor="fitnessLevelSelect" className="form-label mb-1">Fitness Level:</label>
                        <select 
                            id="fitnessLevelSelect" 
                            value={selectedLevel} 
                            onChange={(e) => setSelectedLevel(e.target.value)} 
                            className="input-style w-full"
                        >
                            <option value="" disabled>Loading level...</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        {profileFitnessLevel && selectedLevel !== profileFitnessLevel && 
                            <p className="text-xs text-gray-500 mt-1">Your profile level: {profileFitnessLevel}.</p>}
                    </div>

                    <div className="flex-grow w-full sm:w-auto">
                        <label htmlFor="muscleGroupSelect" className="form-label mb-1">Target Muscle Group:</label>
                        <select 
                            id="muscleGroupSelect"
                            value={selectedMuscleGroup}
                            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                            className="input-style w-full"
                        >
                            {muscleGroupOptions.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        onClick={generateExercises} 
                        disabled={loading || !selectedLevel || !selectedMuscleGroup} 
                        className="btn-primary w-full sm:w-auto mt-2 sm:mt-0 self-stretch sm:self-end disabled:bg-gray-400"
                    >
                        {loading ? 'Getting Exercises...' : 'Get Exercises'}
                    </button>
                </div>

                {loading && <LoadingSpinner />}

                {exercises.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {exercises.map((ex, idx) => (
                            <div key={idx} className="card-item">
                                <div><h3 className="card-title">{ex.exerciseName}</h3><p className="card-description">{ex.description}</p></div>
                                <button onClick={() => openExerciseModal(ex)} className="link-style self-start mt-2">View Instructions &rarr;</button>
                            </div>
                        ))}
                    </div>
                )}
                 <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedExercise?.exerciseName || "Exercise"}>
                    {selectedExercise && (<div className="space-y-3">
                        <div><h4 className="font-semibold">Description:</h4><p className="text-sm">{selectedExercise.description}</p></div>
                        <div><h4 className="font-semibold">Instructions:</h4><ul className="list-disc list-inside text-sm space-y-1 pl-4">{selectedExercise.instructions.map((step,i)=><li key={i}>{step}</li>)}</ul></div>
                    </div>)}
                </Modal>
            </div>
        </div>
    );
};
export default ExerciseGuidePage;