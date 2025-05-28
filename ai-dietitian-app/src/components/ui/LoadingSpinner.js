// --- src/components/ui/LoadingSpinner.js ---
import React from 'react';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
    </div>
);

export default LoadingSpinner;