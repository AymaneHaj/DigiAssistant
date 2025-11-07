import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/authSlice'; // Import the logout action

// Get the Node.js backend URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * This runs *before* every API request.
 * It reads the token from the Redux state and adds it to the Authorization header.
 */
api.interceptors.request.use(
  (config) => {
    // Get token from Redux state instead of localStorage
    const token = store.getState().auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * This runs *after* every API response.
 * It globally handles errors, especially 401 (Unauthorized).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      console.error("API Error 401: Unauthorized. Logging out.");
      // This is the "Senior" way: dispatch the logout action
      // This will clear the Redux state and localStorage,
      // and ProtectedRoute will automatically redirect to /login.
      store.dispatch(logout());

      // We don't need window.location.href here anymore.
    }

    // Return the error so the component can (optionally) catch it
    return Promise.reject(error);
  },
);

export default api;