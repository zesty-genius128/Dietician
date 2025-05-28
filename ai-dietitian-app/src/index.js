// --- src/index.js ---
import React from 'react';
import ReactDOM from 'react-dom/client';
// If you create a global CSS file (e.g., for Tailwind base styles if not using CDN, or other global resets)
// import './index.css'; 
import App from './App'; // This now correctly imports the App component that includes AuthProvider
// import reportWebVitals from './reportWebVitals'; // Optional

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
