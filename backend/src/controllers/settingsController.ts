import { Request, Response } from 'express';
import { z } from 'zod';
import { PortfolioSettings } from '../models/PortfolioSettings';
import { asyncHandler } from '../utils/asyncHandler';
import { logActivity } from '../services/activityService';

export const updateSettingsSchema = z.object({
  heroHeadline: z.string().optional(),
  heroRole: z.string().optional(),
  shortBio: z.string().optional(),
  availability: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  whatsapp: z.string().optional(),
  location: z.string().optional(),
  profileImageUrl: z.string().optional(),
  resumeUrl: z.string().optional(),
  resumePublicId: z.string().optional(),
});

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  let settings = await PortfolioSettings.findOne();

  if (!settings) {
    settings = await PortfolioSettings.create({});
  }

  res.status(200).json({
    success: true,
    data: settings,
  });
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  let settings = await PortfolioSettings.findOne();

  if (!settings) {
    settings = await PortfolioSettings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }

  await logActivity('settings_updated', 'Updated portfolio settings');

  res.status(200).json({
    success: true,
    data: settings,
    message: 'Portfolio settings updated successfully',
  });
});
