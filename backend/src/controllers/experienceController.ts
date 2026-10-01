import { Request, Response } from 'express';
import { z } from 'zod';
import { Experience } from '../models/Experience';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { logActivity } from '../services/activityService';

export const experienceValidationSchema = z.object({
  company: z.string().min(1, 'Company / Organization is required'),
  role: z.string().min(1, 'Role title is required'),
  duration: z.string().optional(),
  type: z.string().optional(),
  points: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

// GET /api/experience (Public: active only)
export const getPublicExperiences = asyncHandler(async (req: Request, res: Response) => {
  const experiences = await Experience.find({ active: true }).sort({ order: 1 });
  res.status(200).json({
    success: true,
    data: experiences,
  });
});

// GET /api/admin/experience (Admin: all)
export const getAdminExperiences = asyncHandler(async (req: Request, res: Response) => {
  const experiences = await Experience.find().sort({ order: 1 });
  res.status(200).json({
    success: true,
    data: experiences,
  });
});

// POST /api/admin/experience
export const createExperience = asyncHandler(async (req: Request, res: Response) => {
  const count = await Experience.countDocuments();
  const order = req.body.order !== undefined ? req.body.order : count + 1;

  const exp = await Experience.create({
    company: req.body.company,
    role: req.body.role,
    duration: req.body.duration || 'Present',
    type: req.body.type || 'Full-time',
    points: Array.isArray(req.body.points) ? req.body.points.filter(Boolean) : [],
    startDate: req.body.startDate || '',
    endDate: req.body.endDate || '',
    current: Boolean(req.body.current),
    order,
    active: req.body.active !== undefined ? req.body.active : true,
  });

  await logActivity('experience_created', `Added experience: ${exp.role} at ${exp.company}`);

  res.status(201).json({
    success: true,
    data: exp,
    message: 'Experience entry created successfully',
  });
});

// PUT /api/admin/experience/:id
export const updateExperience = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const exp = await Experience.findById(id);

  if (!exp) {
    throw new ApiError(404, 'Experience entry not found');
  }

  if (req.body.company !== undefined) exp.company = req.body.company;
  if (req.body.role !== undefined) exp.role = req.body.role;
  if (req.body.duration !== undefined) exp.duration = req.body.duration;
  if (req.body.type !== undefined) exp.type = req.body.type;
  if (req.body.points !== undefined && Array.isArray(req.body.points)) {
    exp.points = req.body.points.filter(Boolean);
  }
  if (req.body.startDate !== undefined) exp.startDate = req.body.startDate;
  if (req.body.endDate !== undefined) exp.endDate = req.body.endDate;
  if (req.body.current !== undefined) exp.current = req.body.current;
  if (req.body.order !== undefined) exp.order = req.body.order;
  if (req.body.active !== undefined) exp.active = req.body.active;

  await exp.save();

  await logActivity('experience_updated', `Updated experience: ${exp.role} at ${exp.company}`);

  res.status(200).json({
    success: true,
    data: exp,
    message: 'Experience entry updated successfully',
  });
});

// DELETE /api/admin/experience/:id
export const deleteExperience = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const exp = await Experience.findById(id);

  if (!exp) {
    throw new ApiError(404, 'Experience entry not found');
  }

  const title = `${exp.role} at ${exp.company}`;
  await exp.deleteOne();

  await logActivity('experience_deleted', `Deleted experience: ${title}`);

  res.status(200).json({
    success: true,
    message: `Experience "${title}" deleted successfully`,
  });
});

// PUT /api/admin/experience/reorder
export const reorderExperiences = asyncHandler(async (req: Request, res: Response) => {
  const { experiences } = req.body;

  if (Array.isArray(experiences)) {
    const bulkOps = experiences.map((item: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));

    if (bulkOps.length > 0) {
      await Experience.bulkWrite(bulkOps);
    }
  }

  await logActivity('experience_updated', 'Reordered experience timeline items');

  res.status(200).json({
    success: true,
    message: 'Experiences reordered successfully',
  });
});
