import mongoose from 'mongoose';
import { ENV } from './env';

export const maskUri = (uri: string): string => {
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
};

export const connectDB = async (): Promise<boolean> => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      dbName: 'portfolio',
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.warn(`[MongoDB] Notice: ${error.message}`);
    console.warn(`[MongoDB] Target: ${maskUri(ENV.MONGODB_URI)}`);
    console.warn(`[MongoDB] To connect: ensure MongoDB is running or configure valid credentials in backend/.env`);
    return false;
  }
};
