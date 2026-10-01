import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IExperience extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
      default: 'Present',
    },
    type: {
      type: String,
      required: true,
      trim: true,
      default: 'Full-time',
    },
    points: {
      type: [String],
      default: [],
    },
    startDate: {
      type: String,
      trim: true,
      default: '',
    },
    endDate: {
      type: String,
      trim: true,
      default: '',
    },
    current: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

experienceSchema.index({ order: 1 });
experienceSchema.index({ active: 1 });

export const Experience: Model<IExperience> =
  mongoose.models.Experience || mongoose.model<IExperience>('Experience', experienceSchema);
