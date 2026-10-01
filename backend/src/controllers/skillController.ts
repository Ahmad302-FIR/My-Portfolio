import { Request, Response } from 'express';
import { z } from 'zod';
import { Skill } from '../models/Skill';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { logActivity } from '../services/activityService';

export const skillValidationSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(50),
  category: z.string().min(1, 'Category is required').max(50),
  iconKey: z.string().optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

export const reorderSkillsSchema = z.object({
  skills: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

// GET /api/skills (Public: active skills only)
export const getPublicSkills = asyncHandler(async (req: Request, res: Response) => {
  const skills = await Skill.find({ active: true }).sort({ category: 1, order: 1 });
  res.status(200).json({
    success: true,
    data: skills,
  });
});

// GET /api/admin/skills (Admin: all skills)
export const getAdminSkills = asyncHandler(async (req: Request, res: Response) => {
  const skills = await Skill.find().sort({ category: 1, order: 1 });
  res.status(200).json({
    success: true,
    data: skills,
  });
});

// POST /api/admin/skills
export const createSkill = asyncHandler(async (req: Request, res: Response) => {
  const count = await Skill.countDocuments({ category: req.body.category });
  const order = req.body.order !== undefined ? req.body.order : count + 1;

  const skill = await Skill.create({
    name: req.body.name,
    category: req.body.category,
    iconKey: req.body.iconKey || '',
    order,
    active: req.body.active !== undefined ? req.body.active : true,
  });

  await logActivity('skill_created', `Added skill: ${skill.name} (${skill.category})`);

  res.status(201).json({
    success: true,
    data: skill,
    message: 'Skill created successfully',
  });
});

// PUT /api/admin/skills/:id
export const updateSkill = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const skill = await Skill.findById(id);

  if (!skill) {
    throw new ApiError(404, 'Skill not found');
  }

  if (req.body.name !== undefined) skill.name = req.body.name;
  if (req.body.category !== undefined) skill.category = req.body.category;
  if (req.body.iconKey !== undefined) skill.iconKey = req.body.iconKey;
  if (req.body.order !== undefined) skill.order = req.body.order;
  if (req.body.active !== undefined) skill.active = req.body.active;

  await skill.save();

  await logActivity('skill_updated', `Updated skill: ${skill.name}`);

  res.status(200).json({
    success: true,
    data: skill,
    message: 'Skill updated successfully',
  });
});

// DELETE /api/admin/skills/:id
export const deleteSkill = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const skill = await Skill.findById(id);

  if (!skill) {
    throw new ApiError(404, 'Skill not found');
  }

  const skillName = skill.name;
  await skill.deleteOne();

  await logActivity('skill_deleted', `Deleted skill: ${skillName}`);

  res.status(200).json({
    success: true,
    message: `Skill "${skillName}" deleted successfully`,
  });
});

// PUT /api/admin/skills/reorder
export const reorderSkills = asyncHandler(async (req: Request, res: Response) => {
  const { skills } = req.body;

  const bulkOps = skills.map((item: { id: string; order: number }) => ({
    updateOne: {
      filter: { _id: item.id },
      update: { $set: { order: item.order } },
    },
  }));

  if (bulkOps.length > 0) {
    await Skill.bulkWrite(bulkOps);
  }

  await logActivity('skills_reordered', `Reordered ${skills.length} skills`);

  res.status(200).json({
    success: true,
    message: 'Skills reordered successfully',
  });
});
