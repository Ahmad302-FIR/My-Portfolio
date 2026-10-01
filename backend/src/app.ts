import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { ENV } from './config/env';
import { errorHandler } from './middleware/errorMiddleware';
import { ApiError } from './utils/ApiError';

// Import route handlers
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import messageRoutes from './routes/messageRoutes';
import settingsRoutes from './routes/settingsRoutes';
import resumeRoutes from './routes/resumeRoutes';
import uploadRoutes from './routes/uploadRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import skillRoutes from './routes/skillRoutes';
import experienceRoutes from './routes/experienceRoutes';

export const createApp = (): Application => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS configuration
  const allowedOrigins = [
    ENV.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive in dev, or origin check
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Static uploads directory for local fallback
  const uploadsDir = path.resolve(__dirname, '../uploads');
  app.use('/uploads', express.static(uploadsDir));

  const getPublicFrontendUrl = (): string | undefined => {
    const configured = (ENV.FRONTEND_URL || '').trim();
    if (configured) {
      return configured;
    }
    return ENV.NODE_ENV !== 'production' ? 'http://localhost:5173' : undefined;
  };

  // Root endpoint
  app.get('/', (req: Request, res: Response) => {
    const frontend = getPublicFrontendUrl();
    res.status(200).json({
      success: true,
      message: 'Muhammad Ahmed Portfolio API',
      status: 'active',
      ...(frontend ? { frontend } : {}),
      endpoints: {
        health: '/api/health',
        projects: '/api/projects',
        settings: '/api/settings',
        messages: '/api/messages',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // API index endpoint
  app.get('/api', (req: Request, res: Response) => {
    const frontend = getPublicFrontendUrl();
    res.status(200).json({
      success: true,
      message: 'Portfolio API Base',
      status: 'active',
      ...(frontend ? { frontend } : {}),
      endpoints: {
        health: '/api/health',
        projects: '/api/projects',
        settings: '/api/settings',
        messages: '/api/messages',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Portfolio Backend API is running healthy',
      database: {
        connected: mongoose.connection.readyState === 1,
        name: mongoose.connection.readyState === 1 ? mongoose.connection.name : 'disconnected',
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/portfolio', portfolioRoutes);
  app.use('/api/skills', skillRoutes);
  app.use('/api/experience', experienceRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/resume', resumeRoutes);
  app.use('/api/admin/resume', resumeRoutes);
  app.use('/api/admin', dashboardRoutes);
  app.use('/api/uploads', uploadRoutes);

  // 404 Handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(404, `Endpoint ${req.method} ${req.originalUrl} not found`));
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
};
