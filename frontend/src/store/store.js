import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice'; // We'll need this soon

/**
 * The main Redux store.
 * We combine all our "slices" (reducers) here.
 */
export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        // results: resultsReducer, // (if needed)
    },
    // Disable Redux DevTools in production
    devTools: process.env.NODE_ENV !== 'production',
});