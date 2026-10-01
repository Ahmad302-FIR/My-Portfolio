import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  iconKey?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: 'Frontend',
    },
    iconKey: {
      type: String,
      trim: true,
      default: '',
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

// Indexes for fast querying & sorting
skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ active: 1 });

export const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>('Skill', skillSchema);
