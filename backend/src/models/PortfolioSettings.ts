import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAboutHighlight {
  icon: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

export interface IAboutStat {
  icon: string;
  value: string;
  label: string;
}

export interface IWorkflowStep {
  label: string;
  icon: string;
  order: number;
  active: boolean;
}

export interface IGithubPractice {
  label: string;
  desc: string;
}

export interface IPortfolioSettings extends Document {
  // Personal & Profile
  name: string;
  profileImageUrl: string;
  profileImagePublicId: string;

  // Hero Section
  heroTitle: string;
  heroHeadline: string;
  heroRole: string;
  heroDescription: string;
  rotatingTitles: string[];
  availability: string;
  location: string;
  locationDetail: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  shortBio: string;

  // Social & Contact Info
  email: string;
  phone: string;
  linkedin: string;
  linkedinDisplay: string;
  github: string;
  githubUsername: string;
  whatsapp: string;

  // About Section
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBioParagraph1: string;
  aboutBioParagraph2: string;
  aboutBioParagraph3: string;
  aboutHighlights: IAboutHighlight[];
  aboutStats: IAboutStat[];

  // Workflow Section
  workflowEyebrow: string;
  workflowTitle: string;
  workflowDescription: string;
  workflowSteps: IWorkflowStep[];
  githubPractices: IGithubPractice[];

  // Backend / Architecture Text
  backendEyebrow: string;
  backendTitle: string;
  backendDescription: string;

  // Tech Marquee Items
  techMarqueeItems: string[];

  // Resume Document
  resumeUrl: string;
  resumePublicId?: string;
  resumeData?: Buffer;
  resumeContentType?: string;
  resumeFileName?: string;

  createdAt: Date;
  updatedAt: Date;
}

const portfolioSettingsSchema = new Schema<IPortfolioSettings>(
  {
    // Personal & Profile
    name: {
      type: String,
      default: 'Muhammad Ahmed',
    },
    profileImageUrl: {
      type: String,
      default: '/profile.jpg',
    },
    profileImagePublicId: {
      type: String,
      default: '',
    },

    // Hero Section
    heroTitle: {
      type: String,
      default: 'Muhammad Ahmed',
    },
    heroHeadline: {
      type: String,
      default: 'Crafting High-Impact Web Applications with Modern Engineering',
    },
    heroRole: {
      type: String,
      default: 'Full Stack MERN Developer',
    },
    heroDescription: {
      type: String,
      default:
        'I build complete web products — from responsive frontend interfaces to secure backend APIs, databases, authentication, and production deployment.',
    },
    rotatingTitles: {
      type: [String],
      default: [
        'Full Stack Developer',
        'MERN Stack Developer',
        'React Developer',
        'Backend API Developer',
      ],
    },
    availability: {
      type: String,
      default: 'Available for freelance & full-time roles',
    },
    location: {
      type: String,
      default: 'Pakistan',
    },
    locationDetail: {
      type: String,
      default: 'Peshawar, Pakistan',
    },
    primaryCtaLabel: {
      type: String,
      default: 'View My Work',
    },
    primaryCtaLink: {
      type: String,
      default: '#projects',
    },
    secondaryCtaLabel: {
      type: String,
      default: 'Contact Me',
    },
    secondaryCtaLink: {
      type: String,
      default: '#contact',
    },
    shortBio: {
      type: String,
      default:
        'I build complete web products — from responsive frontend interfaces to secure backend APIs, databases, authentication, and production deployment.',
    },

    // Social & Contact Info
    email: {
      type: String,
      default: 'info.ahmadkhan.com@gmail.com',
    },
    phone: {
      type: String,
      default: '+92 329 5664981',
    },
    linkedin: {
      type: String,
      default: 'https://www.linkedin.com/in/muhammad-ahmed-6867a5370',
    },
    linkedinDisplay: {
      type: String,
      default: 'Muhammad Ahmed',
    },
    github: {
      type: String,
      default: 'https://github.com/Ahmad302-FIR',
    },
    githubUsername: {
      type: String,
      default: 'Ahmad302-FIR',
    },
    whatsapp: {
      type: String,
      default: 'https://wa.me/923295664981',
    },

    // About Section
    aboutEyebrow: {
      type: String,
      default: 'About Me',
    },
    aboutTitle: {
      type: String,
      default: 'The Person Behind the Code',
    },
    aboutBioParagraph1: {
      type: String,
      default:
        "I'm a MERN Stack Developer focused on building full-stack web applications, dashboards, SaaS-style products, and real-world digital solutions.",
    },
    aboutBioParagraph2: {
      type: String,
      default:
        'I work across frontend development, backend APIs, authentication, databases, deployment, and production problem-solving. My goal is always to ship things that work reliably and look professional.',
    },
    aboutBioParagraph3: {
      type: String,
      default:
        "I'm currently building a healthcare platform with a team at SMIT Peshawar, using modern engineering practices: Git workflows, reusable components, and production-ready code.",
    },
    aboutHighlights: {
      type: [
        {
          icon: { type: String, default: 'code' },
          title: { type: String, default: '' },
          desc: { type: String, default: '' },
          color: { type: String, default: 'text-cyan-400' },
          bg: { type: String, default: 'bg-cyan-400/10 border-cyan-400/20' },
        },
      ],
      default: [
        {
          icon: 'code',
          title: 'Full Stack MERN',
          desc: 'End-to-end development from responsive UI to secure REST APIs and MongoDB schemas.',
          color: 'text-cyan-400',
          bg: 'bg-cyan-400/10 border-cyan-400/20',
        },
        {
          icon: 'server',
          title: 'REST API Development',
          desc: 'Scalable, well-structured APIs with proper error handling and validation.',
          color: 'text-violet-400',
          bg: 'bg-violet-400/10 border-violet-400/20',
        },
        {
          icon: 'shield',
          title: 'Authentication & Authorization',
          desc: 'JWT, bcrypt, OTP verification, and role-based access control.',
          color: 'text-teal-400',
          bg: 'bg-teal-400/10 border-teal-400/20',
        },
        {
          icon: 'rocket',
          title: 'Production Deployment',
          desc: 'Deployment with Vercel, Netlify, Cloudinary, and environment configuration.',
          color: 'text-amber-400',
          bg: 'bg-amber-400/10 border-amber-400/20',
        },
      ],
    },
    aboutStats: {
      type: [
        {
          icon: { type: String, default: 'code' },
          value: { type: String, default: '' },
          label: { type: String, default: '' },
        },
      ],
      default: [
        { icon: 'code', value: '3+', label: 'Full Stack Projects' },
        { icon: 'git-branch', value: 'Git', label: 'Team Collaboration' },
        { icon: 'users', value: 'Team', label: 'Real-World Experience' },
        { icon: 'zap', value: 'MERN', label: 'Modern Web Technologies' },
      ],
    },

    // Workflow Section
    workflowEyebrow: {
      type: String,
      default: 'Development Workflow',
    },
    workflowTitle: {
      type: String,
      default: 'How I Build Products',
    },
    workflowDescription: {
      type: String,
      default:
        'A structured process from idea to production — consistently applied across every project.',
    },
    workflowSteps: {
      type: [
        {
          label: { type: String, required: true },
          icon: { type: String, default: 'code' },
          order: { type: Number, default: 0 },
          active: { type: Boolean, default: true },
        },
      ],
      default: [
        { label: 'Plan', icon: 'lightbulb', order: 1, active: true },
        { label: 'Design', icon: 'layout', order: 2, active: true },
        { label: 'Develop', icon: 'code', order: 3, active: true },
        { label: 'Test', icon: 'check-circle', order: 4, active: true },
        { label: 'Git Commit', icon: 'git-branch', order: 5, active: true },
        { label: 'Deploy', icon: 'upload-cloud', order: 6, active: true },
        { label: 'Improve', icon: 'trending-up', order: 7, active: true },
      ],
    },
    githubPractices: {
      type: [
        {
          label: { type: String, required: true },
          desc: { type: String, required: true },
        },
      ],
      default: [
        { label: 'Clean Repository Structure', desc: 'Organized folders with separation of concerns' },
        { label: 'Reusable Components', desc: 'DRY patterns across projects' },
        { label: 'Git / GitHub Workflow', desc: 'Feature branches, commits, pull requests' },
        { label: 'Environment Variables', desc: '.env files, secrets management' },
        { label: 'API Integration', desc: 'Axios, fetch, error handling patterns' },
        { label: 'Production Deployment', desc: 'Vercel, Netlify, with proper configs' },
        { label: 'Meaningful Commits', desc: 'Descriptive messages and logical history' },
      ],
    },

    // Backend / Architecture Text
    backendEyebrow: {
      type: String,
      default: 'Architecture & Engineering',
    },
    backendTitle: {
      type: String,
      default: 'Full Stack & Backend Capabilities',
    },
    backendDescription: {
      type: String,
      default:
        'Scalable APIs, database schemas, secure authentication, and cloud infrastructure engineered for production reliability.',
    },

    // Tech Marquee Items
    techMarqueeItems: {
      type: [String],
      default: [
        'React.js',
        'Node.js',
        'Express.js',
        'MongoDB',
        'TypeScript',
        'Tailwind CSS',
        'Next.js',
        'REST APIs',
        'JWT',
        'Mongoose',
        'Cloudinary',
        'Vercel',
        'Git',
        'Redux',
        'Framer Motion',
      ],
    },

    // Resume
    resumeUrl: {
      type: String,
      default: '/api/resume',
    },
    resumePublicId: {
      type: String,
      default: '',
    },
    resumeData: {
      type: Buffer,
      select: false,
    },
    resumeContentType: {
      type: String,
      default: 'application/pdf',
    },
    resumeFileName: {
      type: String,
      default: 'Muhammad-Ahmed-Resume.pdf',
    },
  },
  {
    timestamps: true,
  }
);

export const PortfolioSettings: Model<IPortfolioSettings> =
  mongoose.models.PortfolioSettings ||
  mongoose.model<IPortfolioSettings>('PortfolioSettings', portfolioSettingsSchema);
