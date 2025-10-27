// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  }

  return (
    <div className="App">
      <nav style={navStyles}>
        <h1>DigiAssistant</h1>
        {isAuthenticated && (
          <button onClick={handleLogout} style={logoutButtonStyles}>Logout</button>
        )}
      </nav>

      {/* Define Routes */}
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/diagnostic" element={<ChatInterface />} />
        </Route>

        {/* Default route (redirects based on auth) */}
        <Route path="*" element={isAuthenticated ? <Navigate replace to="/diagnostic" /> : <Navigate replace to="/login" />} />
      </Routes>
    </div>
  );
}

// Basic Nav Styles
const navStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#f0f0f0',
  borderBottom: '1px solid #ccc'
};
const logoutButtonStyles = {
  padding: '5px 10px',
  cursor: 'pointer'
};


export default App;