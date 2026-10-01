export interface SkillItem {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  iconKey?: string;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperienceItem {
  _id?: string;
  id?: string;
  company: string;
  role: string;
  duration: string;
  type: string;
  points: string[];
  startDate?: string;
  endDate?: string;
  current: boolean;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutHighlight {
  icon: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

export interface AboutStat {
  icon: string;
  value: string;
  label: string;
}

export interface WorkflowStep {
  label: string;
  icon: string;
  order: number;
  active: boolean;
}

export interface GithubPractice {
  label: string;
  desc: string;
}

export interface PortfolioSettingsData {
  _id?: string;
  name: string;
  profileImageUrl: string;
  profileImagePublicId?: string;

  // Hero
  heroTitle: string;
  heroHeadline: string;
  heroRole: string;
  heroSubtitle?: string;
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

  // Social & Contact
  email: string;
  phone: string;
  linkedin: string;
  linkedinDisplay: string;
  github: string;
  githubUsername: string;
  whatsapp: string;
  whatsappUrl?: string;

  // About
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBioParagraph1: string;
  aboutBioParagraph2: string;
  aboutBioParagraph3: string;
  aboutHighlights: AboutHighlight[];
  aboutStats: AboutStat[];

  // Workflow
  workflowEyebrow: string;
  workflowTitle: string;
  workflowDescription: string;
  workflowSteps: WorkflowStep[];
  githubPractices: GithubPractice[];

  // Backend
  backendEyebrow: string;
  backendTitle: string;
  backendDescription: string;

  // Tech marquee
  techMarqueeItems: string[];

  // Resume
  resumeUrl: string;
  resumePublicId?: string;
  resumeFileName?: string;
}

export interface PortfolioPayload {
  settings: PortfolioSettingsData;
  skills: SkillItem[];
  experiences: ExperienceItem[];
}
