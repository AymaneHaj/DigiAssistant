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

// Get CORS origins from environment variable (can be comma-separated)
const corsOrigins = process.env.CORS 
  ? process.env.CORS.split(',').map(url => url.trim())
  : [];

// Add localhost for development
const allowedOrigins = [
  'http://localhost:5173', // Vite default port
  'http://localhost:3000', // Common React dev port
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  ...corsOrigins
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};


  // Middleware
  app.use(cors(corsOptions));
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
