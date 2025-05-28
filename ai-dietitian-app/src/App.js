// --- src/App.js ---
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext'; 

// Layout Components
import Navbar from './components/layout/Navbar'; 
import Footer from './components/layout/Footer'; 
import LoadingSpinner from './components/ui/LoadingSpinner'; 

// Page Components - Corrected paths
import LoginPage from './pages/auth/LoginPage'; 
import SignupPage from './pages/auth/SignupPage'; 
import ProfilePage from './pages/user/ProfilePage'; 
import FoodLogPage from './pages/logging/FoodLogPage'; 
import ExerciseLogPage from './pages/logging/ExerciseLogPage'; 
import RecipeSuggestionPage from './pages/features/RecipeSuggestionPage'; 
import ExerciseGuidePage from './pages/features/ExerciseGuidePage'; 
import DashboardPage from './pages/DashboardPage'; // Corrected: Path is directly under pages


const AppContent = () => { 
    const [currentPage, setCurrentPage] = useState('login'); 
    const { currentUser, loadingAuth } = useAuth();

    useEffect(() => {
        if (!loadingAuth) {
            if (currentUser && currentUser.email) {
                if (currentPage === 'login' || currentPage === 'signup') setCurrentPage('dashboard');
            } else {
                if (currentPage !== 'login' && currentPage !== 'signup') setCurrentPage('login');
            }
        }
    }, [currentUser, loadingAuth, currentPage, setCurrentPage]); 

    const renderPage = () => {
        if (loadingAuth) {
            return <div className="flex flex-col items-center justify-center min-h-screen"><LoadingSpinner /><p className="mt-4 text-gray-600">Loading application...</p></div>;
        }
        if (!currentUser || !currentUser.email) {
             switch (currentPage) {
                case 'login': return <LoginPage setCurrentPage={setCurrentPage} />;
                case 'signup': return <SignupPage setCurrentPage={setCurrentPage} />;
                default: return <LoginPage setCurrentPage={setCurrentPage} />;
            }
        }
        switch (currentPage) {
            case 'dashboard': return <DashboardPage />;
            case 'profile': return <ProfilePage />;
            case 'logFood': return <FoodLogPage />;
            case 'logExercise': return <ExerciseLogPage />;
            case 'recipes': return <RecipeSuggestionPage />;
            case 'exerciseGuide': return <ExerciseGuidePage />;
            default: return <DashboardPage />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <style jsx global>{`
                .page-container { @apply flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-gray-100 p-4; }
                .form-container { @apply w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg; }
                .form-title { @apply text-2xl sm:text-3xl font-bold text-center text-green-600 mb-6; }
                .form-label { @apply block text-sm font-medium text-gray-700; }
                .error-message { @apply bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm; }
                .input-style { @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm; }
                .btn-primary { @apply py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500; }
                .link-style { @apply font-medium text-green-600 hover:text-green-500; }
                
                .page-content-container { @apply container mx-auto p-4 md:p-6; }
                .content-wrapper-md { @apply bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl max-w-2xl mx-auto; }
                .content-wrapper-lg { @apply bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl max-w-3xl mx-auto; }
                .content-wrapper-xl { @apply bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto; }
                .page-title { @apply text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-4 sm:mb-6; }
                .page-subtitle { @apply text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4; }
                .message-box { @apply p-3 rounded-md mb-4 text-sm; }
                .message-box.error { @apply bg-red-100 text-red-700; }
                .message-box.success { @apply bg-green-100 text-green-700; }
                .form-section { @apply space-y-4 mb-6 sm:mb-8 p-3 sm:p-4 border border-gray-200 rounded-lg; }
                .section-title { @apply text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4; }
                .list-container { @apply space-y-3 max-h-96 overflow-y-auto; }
                .list-item { @apply p-3 bg-gray-50 rounded-md border border-gray-200; }
                .prompt-section { @apply mb-4 sm:mb-6 p-3 sm:p-4 border border-blue-200 rounded-lg bg-blue-50; }
                .prompt-info { @apply text-sm text-blue-700 mb-2; }
                .card-item { @apply bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow flex flex-col justify-between; }
                .card-title { @apply text-lg sm:text-xl font-semibold text-green-600 mb-1 sm:mb-2; }
                .card-description { @apply text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 h-16 sm:h-20 overflow-y-auto;}
                .summary-card { @apply bg-white p-4 sm:p-6 rounded-lg shadow-lg; }
                .summary-title { @apply text-md sm:text-lg font-semibold text-green-600 mb-1 sm:mb-2; }
                .summary-value { @apply text-xl sm:text-2xl font-bold text-gray-800; }
                .summary-unit { @apply text-sm sm:text-base font-normal; }
                .content-box { @apply bg-white p-4 sm:p-6 rounded-lg shadow-lg; }
                .log-item { @apply text-xs sm:text-sm p-2 bg-gray-50 rounded border border-gray-100; }
                .log-date { @apply block text-xs text-gray-500; }
            `}</style>
            {(!loadingAuth) && <Navbar setCurrentPage={setCurrentPage} />}
            <main className="flex-grow w-full">
                {renderPage()}
            </main>
            {(!loadingAuth) && <Footer />}
        </div>
    );
};

const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;
