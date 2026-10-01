import { Request, Response } from 'express';
import { PortfolioSettings } from '../models/PortfolioSettings';
import { Skill } from '../models/Skill';
import { Experience } from '../models/Experience';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * GET /api/portfolio
 * Single optimized public endpoint returning all portfolio CMS data.
 * Does not expose passwords, tokens, or sensitive secrets.
 */
export const getPublicPortfolio = asyncHandler(async (req: Request, res: Response) => {
  let settings = await PortfolioSettings.findOne();

  if (!settings) {
    settings = await PortfolioSettings.create({});
  }

  const [skills, experiences] = await Promise.all([
    Skill.find({ active: true }).sort({ category: 1, order: 1 }).lean(),
    Experience.find({ active: true }).sort({ order: 1 }).lean(),
  ]);

  // Strip internal/sensitive fields like resumeData buffer
  const settingsObj = settings.toObject();
  delete (settingsObj as any).resumeData;

  res.status(200).json({
    success: true,
    data: {
      settings: settingsObj,
      skills,
      experiences,
    },
  });
});
