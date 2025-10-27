import express from 'express';
import { handleChat } from '../controllers/chat.controllers..js';
import { getResults } from '../controllers/results.controllers.js';
import authRoutes from './auth.routes.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Auth routes (public)
router.use('/auth', authRoutes);

// Protected routes
router.post('/v1/chat', authMiddleware, handleChat);
router.get('/v1/results/:conversation_id', authMiddleware, getResults);

export default router;