import mongoose from 'mongoose';
import { Skill } from '../models/Skill';
import { Experience } from '../models/Experience';
import { PortfolioSettings } from '../models/PortfolioSettings';

export const initialSkills = [
  // Frontend
  { name: 'React.js', category: 'Frontend', iconKey: 'react', order: 1 },
  { name: 'Next.js', category: 'Frontend', iconKey: 'next', order: 2 },
  { name: 'TypeScript', category: 'Frontend', iconKey: 'typescript', order: 3 },
  { name: 'JavaScript', category: 'Frontend', iconKey: 'javascript', order: 4 },
  { name: 'HTML5', category: 'Frontend', iconKey: 'html', order: 5 },
  { name: 'CSS3', category: 'Frontend', iconKey: 'css', order: 6 },
  { name: 'Tailwind CSS', category: 'Frontend', iconKey: 'tailwind', order: 7 },
  { name: 'Redux Toolkit', category: 'Frontend', iconKey: 'redux', order: 8 },
  { name: 'React Router', category: 'Frontend', iconKey: 'react', order: 9 },

  // Backend
  { name: 'Node.js', category: 'Backend', iconKey: 'node', order: 1 },
  { name: 'Express.js', category: 'Backend', iconKey: 'express', order: 2 },
  { name: 'REST APIs', category: 'Backend', iconKey: 'api', order: 3 },
  { name: 'JWT', category: 'Backend', iconKey: 'jwt', order: 4 },
  { name: 'bcrypt', category: 'Backend', iconKey: 'shield', order: 5 },
  { name: 'Nodemailer', category: 'Backend', iconKey: 'mail', order: 6 },
  { name: 'Multer', category: 'Backend', iconKey: 'upload', order: 7 },

  // Database
  { name: 'MongoDB', category: 'Database', iconKey: 'mongodb', order: 1 },
  { name: 'Mongoose', category: 'Database', iconKey: 'mongoose', order: 2 },

  // Tools & Deployment
  { name: 'Git', category: 'Tools & Deployment', iconKey: 'git', order: 1 },
  { name: 'GitHub', category: 'Tools & Deployment', iconKey: 'github', order: 2 },
  { name: 'Vercel', category: 'Tools & Deployment', iconKey: 'vercel', order: 3 },
  { name: 'Netlify', category: 'Tools & Deployment', iconKey: 'netlify', order: 4 },
  { name: 'Cloudinary', category: 'Tools & Deployment', iconKey: 'cloudinary', order: 5 },
  { name: 'npm', category: 'Tools & Deployment', iconKey: 'npm', order: 6 },
  { name: 'Postman', category: 'Tools & Deployment', iconKey: 'postman', order: 7 },

  // Practices
  { name: 'Responsive Design', category: 'Practices', iconKey: 'responsive', order: 1 },
  { name: 'API Integration', category: 'Practices', iconKey: 'api', order: 2 },
  { name: 'Form Validation', category: 'Practices', iconKey: 'check', order: 3 },
  { name: 'Role-Based Access', category: 'Practices', iconKey: 'shield', order: 4 },
  { name: 'Performance Optimization', category: 'Practices', iconKey: 'zap', order: 5 },
];

export const initialExperiences = [
  {
    company: 'Saylani Limited Tech / SMIT Peshawar',
    role: 'Team Member · Full Stack Development',
    duration: 'Bootcamp Internship',
    type: 'Internship · Team Project',
    points: [
      'Working on real-world digital products including healthcare platforms',
      'Collaborating with team members using Git and GitHub branch workflows',
      'Building production-style dashboards and healthcare UI modules',
      'Developing with responsive UI patterns, reusable components, and real product requirements',
      'Participating in team-based development, task management, and code reviews',
    ],
    order: 1,
    current: true,
    active: true,
  },
  {
    company: 'SMIT Peshawar',
    role: 'Web Development Training',
    duration: 'Bootcamp',
    type: 'Training · Bootcamp',
    points: [
      'Completed structured web development curriculum covering full-stack MERN development',
      'Built projects covering frontend, backend, authentication, and deployment',
      'Learned modern development practices including TypeScript, REST APIs, and cloud services',
    ],
    order: 2,
    current: false,
    active: true,
  },
];

export const seedPortfolioContent = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database is not connected.');
  }

  // 1. Seed Skills (Idempotent: insert if not existing)
  const existingSkillsCount = await Skill.countDocuments();
  if (existingSkillsCount === 0) {
    console.log('[Seed] Seeding initial technical skills...');
    for (const skill of initialSkills) {
      await Skill.create({
        ...skill,
        active: true,
      });
    }
    console.log(`[Seed] Successfully seeded ${initialSkills.length} skills.`);
  } else {
    console.log(`[Seed] Skills collection already contains ${existingSkillsCount} items. Skipping skill seed.`);
  }

  // 2. Seed Experiences (Idempotent: insert if not existing)
  const existingExpCount = await Experience.countDocuments();
  if (existingExpCount === 0) {
    console.log('[Seed] Seeding initial experiences...');
    for (const exp of initialExperiences) {
      await Experience.create(exp);
    }
    console.log(`[Seed] Successfully seeded ${initialExperiences.length} experience entries.`);
  } else {
    console.log(`[Seed] Experiences collection already contains ${existingExpCount} items. Skipping experience seed.`);
  }

  // 3. Ensure PortfolioSettings Document exists and has complete CMS fields
  let settings = await PortfolioSettings.findOne();
  if (!settings) {
    console.log('[Seed] Creating initial PortfolioSettings document...');
    settings = await PortfolioSettings.create({});
    console.log('[Seed] Created default PortfolioSettings document.');
  } else {
    // Fill in any undefined CMS fields with defaults without overwriting existing data
    let modified = false;
    const defaults = new PortfolioSettings({});

    const fieldsToEnsure = [
      'aboutHighlights',
      'aboutStats',
      'workflowSteps',
      'githubPractices',
      'rotatingTitles',
      'techMarqueeItems',
      'aboutBioParagraph1',
      'aboutBioParagraph2',
      'aboutBioParagraph3',
      'aboutEyebrow',
      'aboutTitle',
      'workflowEyebrow',
      'workflowTitle',
      'workflowDescription',
      'backendEyebrow',
      'backendTitle',
      'backendDescription',
      'primaryCtaLabel',
      'primaryCtaLink',
      'secondaryCtaLabel',
      'secondaryCtaLink',
      'locationDetail',
      'linkedinDisplay',
      'githubUsername',
      'profileImageUrl',
    ] as const;

    for (const field of fieldsToEnsure) {
      if ((settings as any)[field] === undefined || (Array.isArray((settings as any)[field]) && (settings as any)[field].length === 0)) {
        (settings as any)[field] = (defaults as any)[field];
        modified = true;
      }
    }

    if (modified) {
      await settings.save();
      console.log('[Seed] Updated existing PortfolioSettings with complete CMS defaults.');
    } else {
      console.log('[Seed] PortfolioSettings document is already fully populated.');
    }
  }
};
