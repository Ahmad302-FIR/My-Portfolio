import type { SkillCategory, Experience, NavLink } from '../types';

export const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Backend', href: '#backend' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export const rotatingTitles: string[] = [
  'Full Stack Developer',
  'MERN Stack Developer',
  'React Developer',
  'Backend API Developer',
];

export { initialProjects as projects } from './projects';

export const skillCategories: SkillCategory[] = [
  {
    label: 'Frontend',
    skills: [
      { name: 'React.js' },
      { name: 'Next.js' },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'HTML5' },
      { name: 'CSS3' },
      { name: 'Tailwind CSS' },
      { name: 'Redux Toolkit' },
      { name: 'React Router' },
    ],
  },
  {
    label: 'Backend',
    skills: [
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'REST APIs' },
      { name: 'JWT' },
      { name: 'bcrypt' },
      { name: 'Nodemailer' },
      { name: 'Multer' },
    ],
  },
  {
    label: 'Database',
    skills: [
      { name: 'MongoDB' },
      { name: 'Mongoose' },
    ],
  },
  {
    label: 'Tools & Deployment',
    skills: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Vercel' },
      { name: 'Netlify' },
      { name: 'Cloudinary' },
      { name: 'npm' },
      { name: 'Postman' },
    ],
  },
  {
    label: 'Practices',
    skills: [
      { name: 'Responsive Design' },
      { name: 'API Integration' },
      { name: 'Form Validation' },
      { name: 'Role-Based Access' },
      { name: 'Performance Optimization' },
    ],
  },
];

export const experiences: Experience[] = [
  {
    id: 'smit-internship',
    role: 'Team Member · Full Stack Development',
    company: 'Saylani Limited Tech / SMIT Peshawar',
    duration: 'Bootcamp Internship',
    type: 'Internship · Team Project',
    points: [
      'Working on real-world digital products including healthcare platforms',
      'Collaborating with team members using Git and GitHub branch workflows',
      'Building production-style dashboards and healthcare UI modules',
      'Developing with responsive UI patterns, reusable components, and real product requirements',
      'Participating in team-based development, task management, and code reviews',
    ],
  },
  {
    id: 'smit-training',
    role: 'Web Development Training',
    company: 'SMIT Peshawar',
    duration: 'Bootcamp',
    type: 'Training · Bootcamp',
    points: [
      'Completed structured web development curriculum covering full-stack MERN development',
      'Built projects covering frontend, backend, authentication, and deployment',
      'Learned modern development practices including TypeScript, REST APIs, and cloud services',
    ],
  },
];

export const apiEndpoints = [
  { method: 'POST', path: '/api/auth/register', status: 201, label: 'Created' },
  { method: 'POST', path: '/api/auth/login', status: 200, label: 'OK' },
  { method: 'POST', path: '/api/auth/verify-otp', status: 200, label: 'OK' },
  { method: 'POST', path: '/api/reservations', status: 201, label: 'Created' },
  { method: 'GET', path: '/api/reservations/:id', status: 200, label: 'OK' },
  { method: 'PATCH', path: '/api/admin/reservations', status: 200, label: 'OK' },
];

export const workflowSteps = [
  { label: 'Plan', icon: 'lightbulb' },
  { label: 'Design', icon: 'layout' },
  { label: 'Develop', icon: 'code' },
  { label: 'Test', icon: 'check-circle' },
  { label: 'Git Commit', icon: 'git-branch' },
  { label: 'Deploy', icon: 'upload-cloud' },
  { label: 'Improve', icon: 'trending-up' },
];

export const techMarqueeItems = [
  'React.js', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript',
  'Tailwind CSS', 'Next.js', 'REST APIs', 'JWT', 'Mongoose',
  'Cloudinary', 'Vercel', 'Git', 'Redux', 'Framer Motion',
];
