// --- src/pages/auth/SignupPage.js ---
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path

const SignupPage = ({ setCurrentPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { appSignUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) { setError("Passwords do not match."); return; }
        setError(''); setLoading(true);
        try {
            await appSignUp(email, password);
            setCurrentPage('profile'); 
        } catch (err) { setError(err.message); }
        setLoading(false);
    };
    
    return (
        <div className="page-container">
            <div className="form-container">
                <h2 className="form-title">Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label className="form-label">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-style" />
                    </div>
                    <div>
                        <label className="form-label">Password (min. 6 characters)</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-style" />
                    </div>
                    <div>
                        <label className="form-label">Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input-style" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full disabled:bg-gray-400">
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                 <p className="mt-4 text-center text-sm">
                    Already have an account? <button onClick={() => setCurrentPage('login')} className="link-style">Login</button>
                </p>
            </div>
        </div>
    );
};
export default SignupPage;
