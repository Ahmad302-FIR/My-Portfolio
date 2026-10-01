import mongoose from 'mongoose';
import { ENV } from './env';

export const maskUri = (uri: string): string => {
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
};

let cachedPromise: Promise<boolean> | null = null;

export const connectDB = async (): Promise<boolean> => {
  // 1. If connection is already open, reuse it immediately (0 ms overhead)
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // 2. If connection is in progress, await the existing promise
  if (cachedPromise && mongoose.connection.readyState === 2) {
    return cachedPromise;
  }

  // 3. Check for URI definition
  if (!ENV.MONGODB_URI) {
    console.warn('[MongoDB Notice] MONGODB_URI is not configured in environment variables.');
    return false;
  }

  // 4. Initiate and cache connection promise
  cachedPromise = mongoose
    .connect(ENV.MONGODB_URI, {
      dbName: 'portfolio',
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10, // Serverless connection pool limit
      bufferCommands: false, // Don't hang queries forever if disconnected
    })
    .then((conn) => {
      console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
      return true;
    })
    .catch((error: any) => {
      cachedPromise = null; // Reset so next invocation can retry
      console.warn(`[MongoDB] Connection notice: ${error.message}`);
      console.warn(`[MongoDB] Target: ${maskUri(ENV.MONGODB_URI)}`);
      return false;
    });

  return cachedPromise;
};
