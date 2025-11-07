import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * AuthRoute
 * Checks if the user is already authenticated.
 * If authenticated, it redirects them *away* from auth pages (e.g., to /diagnostic).
 * If not, it renders the auth pages (Login, Register).
 */
const AuthRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // We check for isAuthenticated. If they are, redirect to the main app page.
    // This prevents logged-in users from seeing the login page.
    return !isAuthenticated ? <Outlet /> : <Navigate to="/chat" replace />;
};

export default AuthRoute;