import dotenv from 'dotenv';
import path from 'path';

// Load local .env files if present (no error if absent in production)
const candidateEnvPaths = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
];

for (const envPath of candidateEnvPaths) {
  try {
    dotenv.config({ path: envPath });
  } catch {
    // Ignore in serverless environments
  }
}

const parseMongoUri = (): string => {
  let uri = (process.env.MONGODB_URI || '').trim();
  while (uri.startsWith('MONGODB_URI=')) {
    uri = uri.replace(/^MONGODB_URI=/, '').trim();
  }
  // In production, do not fallback to localhost if empty
  if (!uri && process.env.NODE_ENV === 'production') {
    return '';
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

/**
 * Validate presence of production variables without throwing unhandled exceptions
 */
export const validateProductionEnv = (): { valid: boolean; missing: string[] } => {
  const missing: string[] = [];
  if (ENV.NODE_ENV === 'production') {
    if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
    if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
  }
  return {
    valid: missing.length === 0,
    missing,
  };
};
