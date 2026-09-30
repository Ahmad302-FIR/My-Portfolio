import mongoose, { Document, Schema, Model } from 'mongoose';

export type ActivityType =
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'resume_updated'
  | 'password_changed'
  | 'settings_updated';

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
