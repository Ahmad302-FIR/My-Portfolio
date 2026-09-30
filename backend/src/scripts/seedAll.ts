import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { seedAdmin } from './seedAdmin';
import { seedProjects } from './seedProjects';

export const seedAll = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error(
      'Database is not connected. Please verify your MONGODB_URI credentials in backend/.env.'
    );
  }
  console.log('[Seed] Starting database seeding...');
  await seedAdmin();
  await seedProjects();
  console.log('[Seed] Database seeding completed successfully.');
};

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedAll();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('[Seed Error]:', err);
      process.exit(1);
    }
  })();
}
