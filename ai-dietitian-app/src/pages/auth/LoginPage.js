// --- src/pages/auth/LoginPage.js ---
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path

const LoginPage = ({ setCurrentPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { appLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await appLogin(email, password);
            setCurrentPage('dashboard'); 
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="page-container">
            <div className="form-container">
                <h2 className="form-title">Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="form-label">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-style" />
                    </div>
                    <div>
                        <label className="form-label">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-style" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full disabled:bg-gray-400">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Don't have an account? <button onClick={() => setCurrentPage('signup')} className="link-style">Sign up</button>
                </p>
            </div>
        </div>
    );
};
export default LoginPage;
