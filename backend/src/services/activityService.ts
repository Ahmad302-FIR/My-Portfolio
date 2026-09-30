import { Activity, ActivityType } from '../models/Activity';

export interface ActivityItem {
  _id: any;
  type: ActivityType;
  description: string;
  createdAt: Date;
}

export const logActivity = async (type: ActivityType, description: string): Promise<any> => {
  try {
    return await Activity.create({ type, description, createdAt: new Date() });
  } catch (error) {
    console.error('Failed to log activity:', error);
    return null;
  }
};

export const getRecentActivities = async (limit = 10): Promise<ActivityItem[]> => {
  return Activity.find().sort({ createdAt: -1 }).limit(limit).lean() as unknown as ActivityItem[];
};
