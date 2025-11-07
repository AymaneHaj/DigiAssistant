import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { v4 as uuidv4 } from 'uuid'; // For generating conversation_id

// --- Async Thunks ---

/**
 * Thunk 1: Resumes an existing conversation or starts a new one.
 * This is the first action called when loading the chat page.
 */
export const resumeOrStartChat = createAsyncThunk(
    'chat/resumeOrStart',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            // 1. Try to resume
            const response = await api.get('/api/v1/active-conversation');
            // If 200 OK, we have a chat to resume.
            return {
                type: 'resume',
                ...response.data, // { conversation_id, history, current_index }
            };
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // 2. If 404, start a new chat
                console.log('No active chat, starting new one...');
                const newConversationId = uuidv4();
                // We dispatch the *other* thunk (sendMessage) to start the chat
                // We await it and return a special payload so the reducer knows it's a start
                const result = await dispatch(sendMessage({
                    conversationId: newConversationId,
                    userAnswer: null, // No answer for the first message
                    isStart: true
                }));
                
                // Check if sendMessage was rejected (thunk actions have a type property)
                if (result.type && result.type.endsWith('/rejected')) {
                    return rejectWithValue(result.payload || 'Failed to start new chat.');
                }
                
                // Return with type: 'start' so reducer can handle it
                return {
                    type: 'start',
                    ...result.payload
                };
            }
            return rejectWithValue(error.response?.data?.detail || 'Failed to initialize chat.');
        }
    }
);

/**
 * Thunk 2: Sends a user's answer and gets the AI's response.
 */
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ conversationId, userAnswer, isStart = false }, { rejectWithValue }) => {
        try {
            const body = {
                conversation_id: conversationId,
                user_answer: userAnswer,
            };
            // If it's the *first* message, we don't send a user_answer
            if (isStart) {
                delete body.user_answer;
            }

            const response = await api.post('/api/v1/chat', body);

            // response.data = { conversation_id, ai_question, current_criterion_id }
            return {
                ...response.data,
                isStart, // Pass this to the reducer
                userAnswer, // Pass the original answer to add to history
            };

        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to send message.');
        }
    }
);


// --- Initial State ---

const initialState = {
    conversationId: null,
    history: [], // [{ role: 'user'/'ai', content: '...' }]
    isLoading: false, // Start as false, will be set to true when needed
    error: null,
    isFinished: false,
    isInitializing: false, // Flag to prevent multiple initialization calls
};

// --- The Slice ---

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        clearChat: (state) => {
            state.conversationId = null;
            state.history = [];
            state.isLoading = false;
            state.error = null;
            state.isFinished = false;
            state.isInitializing = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- resumeOrStartChat ---
            .addCase(resumeOrStartChat.pending, (state) => {
                // Prevent multiple simultaneous calls
                if (state.isInitializing) {
                    return; // Already initializing, skip
                }
                state.isInitializing = true;
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resumeOrStartChat.fulfilled, (state, action) => {
                console.log('[chatSlice] resumeOrStartChat.fulfilled:', { 
                    type: action.payload.type,
                    conversation_id: action.payload.conversation_id,
                    historyLength: state.history.length 
                });
                
                if (action.payload.type === 'resume') {
                    // Resume existing conversation
                    state.conversationId = action.payload.conversation_id;
                    // We need to re-format the backend history for the UI
                    // Each entry has: ai_question (may be missing), user_answer (required or __PENDING__)
                    state.history = action.payload.history.flatMap(entry => {
                        const messages = [];
                        // Add AI question if it exists (this is the question for this criterion)
                        // Show the question even if user_answer is __PENDING__ (waiting for user to answer)
                        if (entry.ai_question) {
                            messages.push({ role: 'ai', content: entry.ai_question });
                        }
                        // Add user answer (only if it's a real answer, not a placeholder)
                        if (entry.user_answer && entry.user_answer !== '__PENDING__') {
                            messages.push({ role: 'user', content: entry.user_answer });
                        }
                        return messages;
                    });
                    
                    // Log for debugging
                    const lastEntry = action.payload.history && action.payload.history[action.payload.history.length - 1];
                    if (lastEntry) {
                        console.log('[chatSlice] Last entry:', {
                            hasAiQuestion: !!lastEntry.ai_question,
                            hasUserAnswer: !!lastEntry.user_answer,
                            userAnswerIsPending: lastEntry.user_answer === '__PENDING__',
                            aiQuestion: lastEntry.ai_question ? lastEntry.ai_question.substring(0, 50) + '...' : 'none'
                        });
                    }
                    
                    state.isLoading = false;
                    state.isInitializing = false;
                } else if (action.payload.type === 'start') {
                    // Start new conversation - sendMessage.fulfilled already handled adding the first question
                    // Just ensure conversationId is set and isLoading is false
                    // Don't touch history - it was already set by sendMessage.fulfilled
                    state.conversationId = action.payload.conversation_id;
                    state.isLoading = false;
                    state.isInitializing = false;
                    console.log('[chatSlice] After start, history length:', state.history.length);
                }
            })
            .addCase(resumeOrStartChat.rejected, (state, action) => {
                state.isLoading = false;
                state.isInitializing = false;
                state.error = action.payload;
            })

            // --- sendMessage ---
            .addCase(sendMessage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const { ai_question, userAnswer, isStart, conversation_id, current_criterion_id, evaluation, score } = action.payload;

                console.log('[chatSlice] sendMessage.fulfilled:', { 
                    isStart, 
                    hasAiQuestion: !!ai_question, 
                    conversation_id,
                    currentHistoryLength: state.history.length,
                    score: score || (evaluation?.score),
                    hasEvaluation: !!evaluation
                });

                if (!conversation_id) {
                    console.error('sendMessage.fulfilled: Missing conversation_id');
                    state.isLoading = false;
                    return;
                }

                // Prevent duplicate: if conversation_id matches and we already have this question, skip
                if (state.conversationId === conversation_id && state.history.length > 0) {
                    const lastMessage = state.history[state.history.length - 1];
                    if (lastMessage.role === 'ai' && lastMessage.content === ai_question) {
                        console.log('[chatSlice] Duplicate message detected, skipping...');
                        state.isLoading = false;
                        return;
                    }
                }

                state.conversationId = conversation_id;

                // If it wasn't the first message, add the user's answer to history with score
                if (!isStart && userAnswer) {
                    const userMessage = { 
                        role: 'user', 
                        content: userAnswer 
                    };
                    // Add score if available
                    if (score !== undefined || evaluation) {
                        userMessage.score = score !== undefined ? score : evaluation?.score;
                        userMessage.evaluation = evaluation;
                    }
                    state.history.push(userMessage);
                }

                // Add the AI's response (only if we have a question and it's not a duplicate)
                if (ai_question) {
                    // Check if this exact question already exists in history
                    const questionExists = state.history.some(
                        msg => msg.role === 'ai' && msg.content === ai_question
                    );
                    
                    if (!questionExists) {
                        state.history.push({ role: 'ai', content: ai_question });
                        console.log('[chatSlice] Added AI question to history:', ai_question.substring(0, 50) + '...');
                    } else {
                        console.log('[chatSlice] Question already exists in history, skipping duplicate');
                    }
                } else {
                    console.warn('sendMessage.fulfilled: Missing ai_question in response', action.payload);
                }

                if (current_criterion_id === 'FINISHED') {
                    state.isFinished = true;
                }

                state.isLoading = false;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;