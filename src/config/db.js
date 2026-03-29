import mongoose from "mongoose";
import { logger } from './logger.js';


export const connectDB = async () => {
  try {
    const uri = 
    process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

    await mongoose.connect(uri);
    logger.info('MongoDB Connected Successfully');
  } catch (error) {
    logger.error('Error connecting to MongoDB');
  }
}

