import app from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';
import { seedProjects } from './scripts/seedProjects';
import { seedAdmin } from './scripts/seedAdmin';

const startServer = async () => {
  try {
    const server = app.listen(ENV.PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Portfolio Backend running on http://localhost:${ENV.PORT}`);
      console.log(`📡 Environment: ${ENV.NODE_ENV}`);
      console.log(`🛡️  Allowed Origin: ${ENV.FRONTEND_URL}`);
      console.log(`===============================================`);
    });

    // Asynchronously connect to MongoDB and seed if collections are empty (in dev/persistent server)
    connectDB()
      .then(async (isConnected) => {
        if (isConnected) {
          await seedProjects().catch((err) => console.error('[Seed Error] Projects:', err));
          await seedAdmin().catch((err) => console.error('[Seed Error] Admin:', err));
        }
      })
      .catch((err) => {
        console.error('[MongoDB Startup Notice]:', err.message);
      });

    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

// Start the HTTP port listener only if run as a standalone process (node dist/server.js, local tsx)
// In serverless environments like Vercel, process.env.VERCEL is defined, so app.listen is bypassed
if (!process.env.VERCEL && require.main === module) {
  startServer();
}

export default app;
