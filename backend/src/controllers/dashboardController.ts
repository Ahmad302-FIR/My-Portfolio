import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { Message } from '../models/Message';
import { asyncHandler } from '../utils/asyncHandler';
import { getRecentActivities } from '../services/activityService';

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const [
    totalProjects,
    liveProjects,
    inDevelopmentProjects,
    featuredProjects,
    unreadMessages,
    recentProjects,
    recentActivity,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: 'Live' }),
    Project.countDocuments({ status: 'In Development' }),
    Project.countDocuments({ featured: true }),
    Message.countDocuments({ read: false }),
    Project.find().sort({ createdAt: -1 }).limit(5).lean(),
    getRecentActivities(10),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalProjects,
      liveProjects,
      inDevelopmentProjects,
      featuredProjects,
      unreadMessages,
      recentProjects,
      recentActivity,
    },
  });
});
