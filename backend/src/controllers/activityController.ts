import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getRecentActivities } from '../services/activityService';

export const getActivityLogs = asyncHandler(async (req: Request, res: Response) => {
  const activities = await getRecentActivities(10);

  res.status(200).json({
    success: true,
    data: activities,
  });
});
