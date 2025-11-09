import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.routes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// --- CORS Configuration ---
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

// Log allowed origins on startup
console.log('🌐 CORS Configuration:');
console.log('   Allowed origins:', allowedOrigins.length > 0 ? allowedOrigins : 'None (using defaults)');
if (corsOrigins.length > 0) {
  console.log('   From CORS env var:', corsOrigins);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }

    console.log('🔍 CORS: Checking origin:', origin);

    // Allow localhost for development
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      console.log('✅ CORS: Allowing localhost origin');
      return callback(null, true);
    }

    // Allow all Vercel domains (including preview deployments)
    if (/\.vercel\.app$/.test(origin) || origin.includes('vercel.app')) {
      console.log('✅ CORS: Allowing Vercel origin');
      return callback(null, true);
    }

    // Check if origin is in allowed list from .env
    const isAllowed = allowedOrigins.some(allowed => {
      // Support exact match or wildcard patterns
      if (allowed === origin) return true;
      if (allowed.includes('*')) {
        const pattern = allowed.replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`).test(origin);
      }
      return false;
    });

    if (isAllowed) {
      console.log('✅ CORS: Allowing origin from .env list');
      return callback(null, true);
    }

    // Log blocked origin for debugging
    console.error('❌ CORS Blocked:', origin);
    console.log('✅ Allowed origins:', allowedOrigins);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.options('*', cors(corsOptions));

app.use(cors(corsOptions));
// --- End CORS Fix ---

app.use(express.json());

app.get('/', (req, res) => {
  res.send('DigiAssistant Backend (Node.js v2 - Mongoose) is running!');
});

app.use('/api', apiRoutes);

async function startServer() {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

startServer();
