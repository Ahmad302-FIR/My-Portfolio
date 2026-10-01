import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const parseMongoUri = (): string => {
  let uri = (process.env.MONGODB_URI || '').trim();
  while (uri.startsWith('MONGODB_URI=')) {
    uri = uri.replace(/^MONGODB_URI=/, '').trim();
  }
  return uri || 'mongodb://127.0.0.1:27017/portfolio';
};

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: parseMongoUri(),
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_jwt_portfolio_2026_default',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || (process.env.NODE_ENV !== 'production' ? 'http://localhost:5173' : ''),

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'info.ahmadkhan.com@gmail.com',

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'info.ahmadkhan.com@gmail.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Muhammad Ahmed',
};
