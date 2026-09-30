export * from './project';

export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  label: string;
  skills: Skill[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  type: string;
  points: string[];
}

export interface NavLink {
  label: string;
  href: string;
}
