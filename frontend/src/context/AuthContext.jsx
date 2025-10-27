// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; // We'll need axios for the interceptor setup

// Define the backend URL for authentication (adjust if needed)
const AUTH_BACKEND_URL = 'http://127.0.0.1:3001/api/auth'; // Assuming /api/auth exists on your Node backend

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken')); // Load token from storage initially
    const [user, setUser] = useState(null); // Optional: Store user info if backend sends it
    const [isLoading, setIsLoading] = useState(false); // For login loading state

    // Effect to set Axios default header when token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Optional: Fetch user details if needed using the token
            // fetchUserDetails();
        } else {
            localStorage.removeItem('authToken');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    }, [token]);

    // Login function
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            // **IMPORTANT**: Assume your backend has a POST /api/auth/login endpoint
            const response = await axios.post(`${AUTH_BACKEND_URL}/login`, { email, password });

            if (response.data && response.data.token) {
                setToken(response.data.token);
                // Optionally set user data if returned by backend
                // setUser(response.data.user); 
                setIsLoading(false);
                return { success: true };
            } else {
                throw new Error("Login failed: No token received.");
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            setIsLoading(false);
            return { success: false, message: error.response?.data?.message || 'Login failed.' };
        }
    };

    // Logout function
    const logout = () => {
        setToken(null);
    };

    // Value provided to context consumers
    const value = {
        token,
        user,
        isAuthenticated: !!token, // True if token exists
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context easily
export const useAuth = () => {
    return useContext(AuthContext);
};