import React from 'react';

const Footer = () => (
    <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} AI Dietitian App. All rights reserved.</p>
        <p className="text-xs mt-1">Disclaimer: This app provides AI-generated suggestions and is for informational purposes only. It is not a substitute for professional medical or fitness advice. Always consult with a qualified healthcare provider or certified fitness professional before starting any new diet or exercise program.</p>
    </footer>
);

export default Footer;
