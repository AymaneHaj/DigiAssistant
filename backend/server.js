import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.routes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// --- CORS Configuration (Simplified Test) ---

// 1. 7et l links dyalk hna f array
const allowedOrigins = [
  // Localhost
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',

  // Vercel (mn .env awla 7ethom direct)
  'https://front-digiassistant.vercel.app',
  'https://front-digiassistant.3gittkm4-happyshop120-1488s-projects.vercel.app'
];

// 2. T2eked mn l links li 3andek
console.log('🌐 CORS Configuration (Simple):');
console.log('   Allowed origins:', allowedOrigins);

// 3. Had l'objet "a7maq" makaydir 7ta logic, ghir kaychof f l array
const corsOptions = {
  origin: function (origin, callback) {
    // 7ta l check dyal !origin ghadi n7ydoh
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Ila l origin kayn f l array (awla makaynch origin aslan), qbel
      callback(null, true);
    } else {
      // Ila makaynch, rfed (bla error, bla crash)
      console.error(`[CORS Blocked] ❌ ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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
