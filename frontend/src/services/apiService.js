// frontend/src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:3001/api/v1';

/**
 * Starts a new chat conversation or gets the next question.
 * @param {string} conversationId - The ID of the conversation.
 * @param {string|null} userAnswer - The user's answer to the previous question (null for first call).
 * @returns {Promise<object>} - The API response data (ai_question, current_criterion_id).
 */
export const postChatMessage = async (conversationId, userAnswer) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat`, {
            conversation_id: conversationId,
            user_answer: userAnswer,
        });
        return response.data; // { conversation_id, ai_question, current_criterion_id }
    } catch (error) {
        console.error('API Error (postChatMessage):', error.response?.data || error.message);
        // Rje3 error mzyan bach l-component y-handleih
        throw new Error(error.response?.data?.detail || 'Failed to communicate with the backend.');
    }
};

/**
 * Fetches the final diagnostic results.
 * @param {string} conversationId - The ID of the finished conversation.
 * @returns {Promise<object>} - The API response data (report).
 */
export const getResults = async (conversationId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/results/${conversationId}`);
        return response.data; // { conversation_id, global_score, profile_name, ... }
    } catch (error) {
        console.error('API Error (getResults):', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Failed to fetch results.');
    }
};