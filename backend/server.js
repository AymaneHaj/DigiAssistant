import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.routes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// --- CORS Configuration (REGEX FIX - THE BEST SOLUTION) ---
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }

  
    if (/\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // 4. Bloki ay haja okhra
    console.error('CORS Blocked:', origin); // Log l-origin li t-bloka bach t3ref
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));
// --- End CORS Fix ---

app.use(express.json());

app.get('/', (req, res) => {
  res.send('DigiAssistant Backend (Node.js v2 - Mongoose) is running!');
});

app.use('/api', apiRoutes);

async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log("Node.js(ESM) backend listening on port " + port);
  });
}

startServer();
