import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DATABASE_NAME || 'DigiAssistantDB';

export const connectDB = async () => {
  try {
    const connectionUrl = `${MONGODB_URI}/${DB_NAME}?retryWrites=true&w=majority`;
    await mongoose.connect(connectionUrl);
    console.log('Connected to MongoDB (using Mongoose) ✅');
  } catch (error) {
    console.error('MongoDB (Mongoose) connection error:', error);
    process.exit(1);
  }
};