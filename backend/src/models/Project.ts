import mongoose, { Document, Schema, Model } from 'mongoose';

export type ProjectStatus = 'Live' | 'In Development' | 'Completed';

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl?: string;
  imagePublicId?: string;
  liveUrl: string;
  status: ProjectStatus;
  category: string;
  technologies: string[];
  features: string[];
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    imagePublicId: {
      type: String,
      trim: true,
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['Live', 'In Development', 'Completed'],
      default: 'In Development',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering and filtering
projectSchema.index({ order: 1, createdAt: -1 });

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
