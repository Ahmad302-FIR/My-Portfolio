import mongoose, { Document, Schema, Model } from 'mongoose';

export type ActivityType =
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'resume_updated'
  | 'password_changed'
  | 'settings_updated'
  | 'profile_updated'
  | 'profile_image_updated'
  | 'social_links_updated'
  | 'about_updated'
  | 'workflow_updated'
  | 'skill_created'
  | 'skill_updated'
  | 'skill_deleted'
  | 'skills_reordered'
  | 'experience_created'
  | 'experience_updated'
  | 'experience_deleted';

export interface IActivity extends Document {
  type: ActivityType;
  description: string;
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'project_created',
        'project_updated',
        'project_deleted',
        'resume_updated',
        'password_changed',
        'settings_updated',
        'profile_updated',
        'profile_image_updated',
        'social_links_updated',
        'about_updated',
        'workflow_updated',
        'skill_created',
        'skill_updated',
        'skill_deleted',
        'skills_reordered',
        'experience_created',
        'experience_updated',
        'experience_deleted',
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

activitySchema.index({ createdAt: -1 });

export const Activity: Model<IActivity> =
  mongoose.models.Activity || mongoose.model<IActivity>('Activity', activitySchema);
