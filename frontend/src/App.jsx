import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { store } from './store/store';
import { checkAuthStatus } from './store/authSlice';

// Layouts
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import AuthRoute from './components/common/AuthRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DiagnosticPage from './pages/DiagnosticPage';
import ResultsPage from './pages/ResultsPAge';

// Simple Spinner for initial load
import Spinner from './components/common/Spinner';

function App() {
  const { isLoading } = useSelector((state) => state.auth);

  // On initial app load, check auth status from localStorage
  useEffect(() => {
    store.dispatch(checkAuthStatus());
  }, []);

  // Show a global spinner while Redux rehydrates auth state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spinner />
      </div>
    );
  }

  return (
    <Routes>

      {/* 1. Auth Routes (Login / Register) */}
      {/* Uses <AuthLayout> and is protected by <AuthRoute> */}
      <Route element={<AuthRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* 2. Protected Routes (Chat / Results / Dashboard) */}
      {/* Uses <MainLayout> and is protected by <ProtectedRoute> */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/chat" element={<DiagnosticPage />} />
          <Route path="/diagnostic" element={<DiagnosticPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          {/* Add other protected pages (like /dashboard) here */}
        </Route>
      </Route>

      {/* 3. Public Routes (Landing Page) */}
      {/* Uses <MainLayout> */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* 4. Catch-all (404) Route */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;