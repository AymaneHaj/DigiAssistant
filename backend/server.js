// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.routes.js';
import cors from 'cors';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.get('/', (req, res) => {
  res.send('DigiAssistant Backend (Node.js v2 - Mongoose) is running!');
});

// Mount API routes. Individual routes decide whether they need auth.
app.use('/api', apiRoutes);


async function startServer() {
  await connectDB();
  
  app.listen(port, () => {
    console.log(`Node.js (ESM) backend listening on http://127.0.0.1:${port}`);
  });
}

startServer();