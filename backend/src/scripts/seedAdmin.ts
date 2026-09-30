import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Admin } from '../models/Admin';
import { ENV } from '../config/env';

export const seedAdmin = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error(
      'MongoDB is not connected. Please check your MONGODB_URI credentials in backend/.env.'
    );
  }

  const existingAdmin = await Admin.findOne({ email: ENV.ADMIN_EMAIL.toLowerCase() });

  if (existingAdmin) {
    console.log(`[Seed] Admin already exists with email: ${ENV.ADMIN_EMAIL}`);
    return;
  }

  const password = ENV.ADMIN_PASSWORD || 'Admin@Portfolio2026';
  const name = ENV.ADMIN_NAME || 'Muhammad Ahmed';

  await Admin.create({
    name,
    email: ENV.ADMIN_EMAIL.toLowerCase(),
    password, // Pre-save hook hashes it with bcrypt
    role: 'admin',
  });

  console.log(`[Seed] Successfully created initial admin: ${name} (${ENV.ADMIN_EMAIL})`);
};

// If run directly via CLI
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedAdmin();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('[Seed Error]:', err);
      process.exit(1);
    }
  })();
}
