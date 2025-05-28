// --- src/components/layout/Navbar.js ---
import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path

const Navbar = ({ setCurrentPage }) => {
    const { currentUser, appSignOut, userId } = useAuth();

    return (
        <nav className="bg-green-600 p-4 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex flex-wrap justify-between items-center">
                <div className="flex items-center mb-2 sm:mb-0">
                    {/* SVG Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75v1.5a2.25 2.25 0 0 1-2.25 2.25h-3.375v5.625c0 .621-.504 1.125-1.125 1.125H9.375c-.621 0-1.125-.504-1.125-1.125V13.5H4.5a2.25 2.25 0 0 1-2.25-2.25V9.75M15 3.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V5.56l-2.72 2.72a.75.75 0 0 1-1.06-1.06l2.72-2.72H15.75a.75.75 0 0 1-.75-.75Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v3.75a.75.75 0 0 0 1.5 0V5.56l2.72 2.72a.75.75 0 0 0 1.06-1.06L6.44 4.5h1.81a.75.75 0 0 0 .75-.75Z" />
                    </svg>
                    <h1 className="text-xl sm:text-2xl font-bold cursor-pointer" onClick={() => setCurrentPage('dashboard')}>AI Dietitian</h1>
                </div>
                <div className="flex flex-wrap space-x-1 sm:space-x-2 text-xs sm:text-sm">
                    {currentUser && currentUser.email ? (
                        <>
                            <button onClick={() => setCurrentPage('dashboard')} className="nav-button">Dashboard</button>
                            <button onClick={() => setCurrentPage('profile')} className="nav-button">Profile</button>
                            <button onClick={() => setCurrentPage('logFood')} className="nav-button">Log Food</button>
                            <button onClick={() => setCurrentPage('logExercise')} className="nav-button">Log Exercise</button>
                            <button onClick={() => setCurrentPage('recipes')} className="nav-button">Recipes</button>
                            <button onClick={() => setCurrentPage('exerciseGuide')} className="nav-button">Exercise Guide</button>
                            <button onClick={appSignOut} className="bg-red-500 hover:bg-red-600 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">Sign Out</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setCurrentPage('login')} className="nav-button">Login</button>
                            <button onClick={() => setCurrentPage('signup')} className="nav-button">Sign Up</button>
                        </>
                    )}
                </div>
            </div>
            {currentUser && currentUser.email && <div className="text-xs text-center text-green-100 mt-1 w-full">User ID: {userId}</div>}
            <style jsx global>{`
                .nav-button {
                    @apply hover:text-green-200 py-1 px-1 sm:px-2 rounded;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
