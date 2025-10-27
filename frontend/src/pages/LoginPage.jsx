// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom'; // For redirecting after login

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            // Redirect to the diagnostic page on successful login
            navigate('/diagnostic');
        } else {
            setError(result.message);
        }
    };

    // If already authenticated, redirect away from login page
    if (isAuthenticated) {
        return <Navigate to="/diagnostic" replace />;
    }


    return (
        <div style={styles.container}>
            <h2>Login to DigiAssistant</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button} disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {/* Optional: Add link to Register page */}
            {/* <p>Don't have an account? <Link to="/register">Sign Up</Link></p> */}
        </div>
    );
}

// Basic Styles
const styles = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { textAlign: 'left' },
    input: { width: '100%', padding: '10px', boxSizing: 'border-box' },
    button: { padding: '10px 15px', backgroundColor: '#007aff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    error: { color: 'red', fontSize: '0.9em' }
};

export default LoginPage;