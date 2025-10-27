// frontend/src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading indicator while checking auth status (optional but good UX)
    // You might need a more sophisticated loading check in a real app
    if (isLoading && !isAuthenticated) {
        return <div>Loading authentication...</div>;
    }

    // If authenticated, render the child component (Outlet)
    // Otherwise, redirect to the login page
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;