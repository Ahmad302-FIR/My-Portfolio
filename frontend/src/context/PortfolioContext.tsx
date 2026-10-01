import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { contactConfig } from '../data/contact';
import { experiences as initialExperiences, skillCategories as initialSkillCategories } from '../data/portfolioData';
import { portfolioService } from '../services/portfolioService';
import { formatResumeUrl } from '../services/settingsService';
import type { PortfolioSettingsData, SkillItem, ExperienceItem } from '../types/portfolio';

// Flatten initial skills for default state
const defaultInitialSkills: SkillItem[] = initialSkillCategories.flatMap((cat, catIdx) =>
  cat.skills.map((s, sIdx) => ({
    id: `${cat.label}-${s.name}`,
    name: s.name,
    category: cat.label,
    iconKey: s.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    order: catIdx * 10 + sIdx,
    active: true,
  }))
);

const defaultInitialExperiences: ExperienceItem[] = initialExperiences.map((exp, idx) => ({
  id: exp.id,
  role: exp.role,
  company: exp.company,
  duration: exp.duration,
  type: exp.type,
  points: exp.points,
  current: idx === 0,
  order: idx + 1,
  active: true,
}));

export const defaultSettings: PortfolioSettingsData = {
  name: contactConfig.name,
  profileImageUrl: '/profile.jpg',
  profileImagePublicId: '',

  // Hero
  heroTitle: 'Muhammad Ahmed',
  heroHeadline: 'Crafting High-Impact Web Applications with Modern Engineering',
  heroRole: 'Full Stack MERN Developer',
  heroDescription:
    'I build complete web products — from responsive frontend interfaces to secure backend APIs, databases, authentication, and production deployment.',
  rotatingTitles: [
    'Full Stack Developer',
    'MERN Stack Developer',
    'React Developer',
    'Backend API Developer',
  ],
  availability: contactConfig.availability,
  location: contactConfig.location,
  locationDetail: contactConfig.locationDetail,
  primaryCtaLabel: 'View My Work',
  primaryCtaLink: '#projects',
  secondaryCtaLabel: 'Contact Me',
  secondaryCtaLink: '#contact',
  shortBio:
    'I build complete web products — from responsive frontend interfaces to secure backend APIs, databases, authentication, and production deployment.',

  // Social & Contact
  email: contactConfig.email,
  phone: contactConfig.phone,
  linkedin: contactConfig.linkedin,
  linkedinDisplay: contactConfig.linkedinDisplay,
  github: contactConfig.github,
  githubUsername: contactConfig.githubUsername,
  whatsapp: contactConfig.whatsappUrl,

  // About
  aboutEyebrow: 'About Me',
  aboutTitle: 'The Person Behind the Code',
  aboutBioParagraph1:
    "I'm a MERN Stack Developer focused on building full-stack web applications, dashboards, SaaS-style products, and real-world digital solutions.",
  aboutBioParagraph2:
    'I work across frontend development, backend APIs, authentication, databases, deployment, and production problem-solving. My goal is always to ship things that work reliably and look professional.',
  aboutBioParagraph3:
    "I'm currently building a healthcare platform with a team at SMIT Peshawar, using modern engineering practices: Git workflows, reusable components, and production-ready code.",
  aboutHighlights: [
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
  aboutStats: [
    { icon: 'code', value: '3+', label: 'Full Stack Projects' },
    { icon: 'git-branch', value: 'Git', label: 'Team Collaboration' },
    { icon: 'users', value: 'Team', label: 'Real-World Experience' },
    { icon: 'zap', value: 'MERN', label: 'Modern Web Technologies' },
  ],

  // Workflow
  workflowEyebrow: 'Development Workflow',
  workflowTitle: 'How I Build Products',
  workflowDescription:
    'A structured process from idea to production — consistently applied across every project.',
  workflowSteps: [
    { label: 'Plan', icon: 'lightbulb', order: 1, active: true },
    { label: 'Design', icon: 'layout', order: 2, active: true },
    { label: 'Develop', icon: 'code', order: 3, active: true },
    { label: 'Test', icon: 'check-circle', order: 4, active: true },
    { label: 'Git Commit', icon: 'git-branch', order: 5, active: true },
    { label: 'Deploy', icon: 'upload-cloud', order: 6, active: true },
    { label: 'Improve', icon: 'trending-up', order: 7, active: true },
  ],
  githubPractices: [
    { label: 'Clean Repository Structure', desc: 'Organized folders with separation of concerns' },
    { label: 'Reusable Components', desc: 'DRY patterns across projects' },
    { label: 'Git / GitHub Workflow', desc: 'Feature branches, commits, pull requests' },
    { label: 'Environment Variables', desc: '.env files, secrets management' },
    { label: 'API Integration', desc: 'Axios, fetch, error handling patterns' },
    { label: 'Production Deployment', desc: 'Vercel, Netlify, with proper configs' },
    { label: 'Meaningful Commits', desc: 'Descriptive messages and logical history' },
  ],

  // Backend
  backendEyebrow: 'Architecture & Engineering',
  backendTitle: 'Full Stack & Backend Capabilities',
  backendDescription:
    'Scalable APIs, database schemas, secure authentication, and cloud infrastructure engineered for production reliability.',

  // Tech marquee
  techMarqueeItems: [
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

  // Resume
  resumeUrl: contactConfig.resumePath,
  resumePublicId: '',
  resumeFileName: 'Muhammad-Ahmed-Resume.pdf',
};

interface PortfolioContextType {
  settings: PortfolioSettingsData & { whatsappUrl: string; heroSubtitle: string };
  skills: SkillItem[];
  experiences: ExperienceItem[];
  refreshPortfolio: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType>({
  settings: {
    ...defaultSettings,
    whatsappUrl: defaultSettings.whatsapp,
    heroSubtitle: defaultSettings.heroRole,
  },
  skills: defaultInitialSkills,
  experiences: defaultInitialExperiences,
  refreshPortfolio: async () => {},
  refreshSettings: async () => {},
  loading: true,
});

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PortfolioSettingsData>(defaultSettings);
  const [skills, setSkills] = useState<SkillItem[]>(defaultInitialSkills);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(defaultInitialExperiences);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = useCallback(async () => {
    try {
      const data = await portfolioService.getPortfolio();
      if (data) {
        if (data.settings) {
          setSettings((prev) => ({
            ...prev,
            ...data.settings,
            resumeUrl: formatResumeUrl(data.settings.resumeUrl || prev.resumeUrl),
          }));
        }
        if (Array.isArray(data.skills) && data.skills.length > 0) {
          setSkills(data.skills);
        }
        if (Array.isArray(data.experiences) && data.experiences.length > 0) {
          setExperiences(data.experiences);
        }
      }
    } catch (err) {
      console.warn('Could not load portfolio CMS data from backend, using defaults:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const augmentedSettings = {
    ...settings,
    whatsappUrl: settings.whatsapp || defaultSettings.whatsapp,
    heroSubtitle: settings.heroRole || settings.heroTitle || 'Full Stack MERN Developer',
  };

  return (
    <PortfolioContext.Provider
      value={{
        settings: augmentedSettings,
        skills,
        experiences,
        refreshPortfolio: fetchPortfolio,
        refreshSettings: fetchPortfolio,
        loading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioSettings = () => useContext(PortfolioContext);
export const usePortfolio = usePortfolioSettings;
