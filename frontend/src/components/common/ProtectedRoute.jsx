import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * ProtectedRoute
 * Checks if the user is authenticated (from Redux state).
 * If authenticated, it renders the child routes (<Outlet />).
 * If not, it redirects the user to the /login page.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-white to-[#F8F9FA]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#008C9E]/20 border-t-[#008C9E] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-[#343A40]">Verifying authentication...</p>
        </motion.div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
