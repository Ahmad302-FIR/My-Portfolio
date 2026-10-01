import { Request, Response } from 'express';
import { z } from 'zod';
import { PortfolioSettings } from '../models/PortfolioSettings';
import { asyncHandler } from '../utils/asyncHandler';
import { logActivity } from '../services/activityService';
import { deleteCloudinaryAsset } from '../services/cloudinaryService';

export const updateSettingsSchema = z.object({
  // Personal & Profile
  name: z.string().min(1).max(100).optional(),
  profileImageUrl: z.string().optional(),
  profileImagePublicId: z.string().optional(),

  // Hero Section
  heroTitle: z.string().optional(),
  heroHeadline: z.string().optional(),
  heroRole: z.string().optional(),
  heroDescription: z.string().optional(),
  rotatingTitles: z.array(z.string()).optional(),
  availability: z.string().optional(),
  location: z.string().optional(),
  locationDetail: z.string().optional(),
  primaryCtaLabel: z.string().optional(),
  primaryCtaLink: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  shortBio: z.string().optional(),

  // Social & Contact
  email: z.string().email().optional(),
  phone: z.string().optional(),
  linkedin: z.string().url().optional(),
  linkedinDisplay: z.string().optional(),
  github: z.string().url().optional(),
  githubUsername: z.string().optional(),
  whatsapp: z.string().optional(),

  // About Section
  aboutEyebrow: z.string().optional(),
  aboutTitle: z.string().optional(),
  aboutBioParagraph1: z.string().optional(),
  aboutBioParagraph2: z.string().optional(),
  aboutBioParagraph3: z.string().optional(),
  aboutHighlights: z
    .array(
      z.object({
        icon: z.string().default('code'),
        title: z.string(),
        desc: z.string(),
        color: z.string().default('text-cyan-400'),
        bg: z.string().default('bg-cyan-400/10 border-cyan-400/20'),
      })
    )
    .optional(),
  aboutStats: z
    .array(
      z.object({
        icon: z.string().default('code'),
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),

  // Workflow Section
  workflowEyebrow: z.string().optional(),
  workflowTitle: z.string().optional(),
  workflowDescription: z.string().optional(),
  workflowSteps: z
    .array(
      z.object({
        label: z.string(),
        icon: z.string().default('code'),
        order: z.number().default(0),
        active: z.boolean().default(true),
      })
    )
    .optional(),
  githubPractices: z
    .array(
      z.object({
        label: z.string(),
        desc: z.string(),
      })
    )
    .optional(),

  // Backend / Architecture Text
  backendEyebrow: z.string().optional(),
  backendTitle: z.string().optional(),
  backendDescription: z.string().optional(),

  // Tech Marquee Items
  techMarqueeItems: z.array(z.string()).optional(),

  // Resume Document
  resumeUrl: z.string().optional(),
  resumePublicId: z.string().optional(),
});

// GET /api/settings (Public: returns display settings)
export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  let settings = await PortfolioSettings.findOne();

  if (!settings) {
    settings = await PortfolioSettings.create({});
  }

  // Hide internal binary buffers from public response
  const settingsObj = settings.toObject();
  delete (settingsObj as any).resumeData;

  res.status(200).json({
    success: true,
    data: settingsObj,
  });
});

// PUT /api/settings (Admin protected)
export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  let settings = await PortfolioSettings.findOne();

  if (!settings) {
    settings = await PortfolioSettings.create({});
  }

  const oldProfileImagePublicId = settings.profileImagePublicId;

  // Check if profile image is being replaced
  if (
    req.body.profileImagePublicId &&
    oldProfileImagePublicId &&
    req.body.profileImagePublicId !== oldProfileImagePublicId
  ) {
    try {
      await deleteCloudinaryAsset(oldProfileImagePublicId, 'image');
    } catch (err) {
      console.warn('Could not delete old profile photo asset:', err);
    }
  }

  // Activity logging determination based on what changed
  const isImageUpdate = Boolean(
    req.body.profileImageUrl && req.body.profileImageUrl !== settings.profileImageUrl
  );
  const isHeroUpdate = Boolean(
    req.body.heroHeadline || req.body.heroRole || req.body.rotatingTitles || req.body.availability
  );
  const isSocialUpdate = Boolean(
    req.body.linkedin || req.body.github || req.body.whatsapp || req.body.email || req.body.phone
  );
  const isAboutUpdate = Boolean(
    req.body.aboutTitle || req.body.aboutBioParagraph1 || req.body.aboutHighlights || req.body.aboutStats
  );
  const isWorkflowUpdate = Boolean(req.body.workflowSteps || req.body.githubPractices);

  Object.assign(settings, req.body);
  await settings.save();

  if (isImageUpdate) {
    await logActivity('profile_image_updated', 'Updated profile picture');
  } else if (isHeroUpdate) {
    await logActivity('profile_updated', 'Updated profile & hero content');
  } else if (isSocialUpdate) {
    await logActivity('social_links_updated', 'Updated social & contact links');
  } else if (isAboutUpdate) {
    await logActivity('about_updated', 'Updated about section content');
  } else if (isWorkflowUpdate) {
    await logActivity('workflow_updated', 'Updated development workflow & practices');
  } else {
    await logActivity('settings_updated', 'Updated portfolio settings');
  }

  const updatedObj = settings.toObject();
  delete (updatedObj as any).resumeData;

  res.status(200).json({
    success: true,
    data: updatedObj,
    message: 'Portfolio settings updated successfully',
  });
});
