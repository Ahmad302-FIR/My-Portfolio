import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Project } from '../models/Project';

export const seedProjects = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error(
      'MongoDB is not connected. Please check your MONGODB_URI credentials in backend/.env.'
    );
  }

  const defaultProjects = [
    {
      title: 'Digital Medical',
      slug: 'digital-medical',
      category: 'Healthcare Platform',
      status: 'In Development',
      liveUrl: 'https://digital-medical-tau.vercel.app/',
      shortDescription:
        'A healthcare platform for patient records, appointment booking, doctor and clinic discovery, family/dependent profiles, and healthcare management.',
      description:
        'A comprehensive digital healthcare platform designed to digitalize clinical operations, patient records, appointment scheduling, doctor discovery, and dependent family healthcare profiles with separate medical identities and multi-role access.',
      imageUrl: '',
      imagePublicId: '',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Git', 'GitHub'],
      features: [
        'Patient Dashboard',
        'Doctor & Clinic Discovery',
        'Appointment Booking',
        'Family / Dependent Profiles',
        'Separate Medical Identities',
        'Medical Records',
        'Prescriptions & Lab Reports',
        'Follow-up Management',
        'Multi-Role System',
        'Responsive Dashboard UI',
      ],
      featured: true,
      order: 1,
    },
    {
      title: 'AKR Restaurant',
      slug: 'akr-restaurant',
      category: 'Full Stack MERN Application',
      status: 'Live',
      liveUrl: 'https://frontend-sepia-eight-58.vercel.app/',
      shortDescription:
        'A full-stack restaurant platform with authentication, OTP verification, reservation requests, admin approval workflow, reservation tracking, and email notifications.',
      description:
        'A full-stack restaurant platform with end-to-end MERN architecture. Implements JWT authentication, OTP email verification, automated reservation requests, admin approval workflow, live reservation tracking, Cloudinary media storage, and transactional emails.',
      imageUrl: '',
      imagePublicId: '',
      technologies: [
        'React',
        'TypeScript',
        'Tailwind CSS',
        'Node.js',
        'Express.js',
        'MongoDB',
        'Mongoose',
        'JWT',
        'Nodemailer',
        'Multer',
        'Cloudinary',
      ],
      features: [
        'User Registration & Login',
        'OTP Email Verification',
        'Reservation Request Workflow',
        'Admin Approve / Reject System',
        'Reservation Tracking',
        'Protected Admin Routes',
        'Image Upload & Cloudinary',
        'Email Notifications',
        'Responsive Frontend',
        'Production Deployment',
      ],
      featured: true,
      order: 2,
    },
    {
      title: 'Laptop Shop',
      slug: 'laptop-shop',
      category: 'E-commerce / Web Application',
      status: 'Live',
      liveUrl: 'https://laptop-shop-nine.vercel.app/',
      shortDescription:
        'A responsive laptop shopping web application with modern product browsing and clean responsive UI.',
      description:
        'A responsive laptop shopping web application with modern product browsing and clean responsive UI.',
      imageUrl: '',
      imagePublicId: '',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      features: [
        'Product Browsing',
        'Responsive Layout Across Devices',
        'Category & Hardware Filters',
        'Search & Filtering',
        'Clean Modern UI Design',
        'Vercel Deployment',
      ],
      featured: true,
      order: 3,
    },
  ];

  let seededCount = 0;
  for (const projectData of defaultProjects) {
    const existing = await Project.findOne({ slug: projectData.slug.toLowerCase() });
    if (!existing) {
      await Project.create(projectData);
      console.log(`[Seed] Created project: "${projectData.title}" (${projectData.slug})`);
      seededCount++;
    } else {
      console.log(`[Seed] Project already exists: "${projectData.title}" (${projectData.slug})`);
    }
  }

  if (seededCount > 0) {
    console.log(`[Seed] Successfully seeded ${seededCount} new projects into MongoDB.`);
  } else {
    console.log(`[Seed] All initial projects are already present in MongoDB.`);
  }
};

// If run directly via CLI
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedProjects();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('[Seed Error]:', err);
      process.exit(1);
    }
  })();
}
