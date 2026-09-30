import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPortfolioSettings extends Document {
  heroHeadline: string;
  heroRole: string;
  shortBio: string;
  availability: string;
  name: string;
  email: string;
  linkedin: string;
  github: string;
  whatsapp: string;
  location: string;
  resumeUrl: string;
  resumePublicId?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSettingsSchema = new Schema<IPortfolioSettings>(
  {
    heroHeadline: {
      type: String,
      default: 'Crafting High-Impact Web Applications with Modern Engineering',
    },
    heroRole: {
      type: String,
      default: 'MERN Stack Developer & Full Stack Web Engineer',
    },
    shortBio: {
      type: String,
      default: 'I build scalable, modern web applications with React, TypeScript, Node.js, and MongoDB.',
    },
    availability: {
      type: String,
      default: 'Available for freelance & full-time roles',
    },
    name: {
      type: String,
      default: 'Muhammad Ahmed',
    },
    email: {
      type: String,
      default: 'info.ahmadkhan.com@gmail.com',
    },
    linkedin: {
      type: String,
      default: 'https://www.linkedin.com/in/muhammad-ahmed-6867a5370',
    },
    github: {
      type: String,
      default: 'https://github.com/Ahmad302-FIR',
    },
    whatsapp: {
      type: String,
      default: 'https://wa.me/923295664981',
    },
    location: {
      type: String,
      default: 'Pakistan (Remote / Worldwide)',
    },
    resumeUrl: {
      type: String,
      default: '/Muhammad-Ahmed-Resume.pdf',
    },
    resumePublicId: {
      type: String,
      default: '',
    },
    profileImageUrl: {
      type: String,
      default: '/profile.jpg',
    },
  },
  {
    timestamps: true,
  }
);

export const PortfolioSettings: Model<IPortfolioSettings> =
  mongoose.models.PortfolioSettings || mongoose.model<IPortfolioSettings>('PortfolioSettings', portfolioSettingsSchema);
