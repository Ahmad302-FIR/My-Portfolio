import { Request, Response } from 'express';
import { z } from 'zod';
import { Project } from '../models/Project';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { deleteCloudinaryAsset } from '../services/cloudinaryService';
import { logActivity } from '../services/activityService';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z.string().min(1, 'Slug is required').trim(),
  shortDescription: z.string().min(1, 'Short description is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  imageUrl: z.string().optional().default(''),
  imagePublicId: z.string().optional().default(''),
  liveUrl: z.union([z.string().url('Please enter a valid URL for live project'), z.literal('')]).optional().default(''),
  status: z.enum(['Live', 'In Development', 'Completed']),
  category: z.string().min(1, 'Category is required'),
  technologies: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const updateProjectSchema = projectSchema.partial();

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();

  res.status(200).json({
    success: true,
    data: projects,
  });
});

export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const project = await Project.findOne({ slug: slug.toLowerCase() }).lean();

  if (!project) {
    throw new ApiError(404, `Project with slug "${slug}" not found`);
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const projectData = req.body;

  // Ensure slug uniqueness
  const existing = await Project.findOne({ slug: projectData.slug.toLowerCase() });
  if (existing) {
    throw new ApiError(409, `A project with the slug "${projectData.slug}" already exists`);
  }

  const project = await Project.create({
    ...projectData,
    slug: projectData.slug.toLowerCase(),
  });

  await logActivity('project_created', `Created project: "${project.title}"`);

  res.status(201).json({
    success: true,
    data: project,
  });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const projectData = req.body;

  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // If slug was changed, check uniqueness
  if (projectData.slug && projectData.slug.toLowerCase() !== project.slug) {
    const existing = await Project.findOne({ slug: projectData.slug.toLowerCase(), _id: { $ne: id } });
    if (existing) {
      throw new ApiError(409, `A project with the slug "${projectData.slug}" already exists`);
    }
  }

  // If image was replaced and previous image had a public ID, remove old asset
  if (
    projectData.imagePublicId &&
    project.imagePublicId &&
    projectData.imagePublicId !== project.imagePublicId
  ) {
    await deleteCloudinaryAsset(project.imagePublicId, 'image');
  }

  Object.assign(project, {
    ...projectData,
    slug: projectData.slug ? projectData.slug.toLowerCase() : project.slug,
  });

  await project.save();
  await logActivity('project_updated', `Updated project: "${project.title}"`);

  res.status(200).json({
    success: true,
    data: project,
  });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (project.imagePublicId) {
    await deleteCloudinaryAsset(project.imagePublicId, 'image');
  }

  await project.deleteOne();
  await logActivity('project_deleted', `Deleted project: "${project.title}"`);

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
  });
});

export const toggleFeatured = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  project.featured = !project.featured;
  await project.save();

  res.status(200).json({
    success: true,
    data: project,
  });
});

export const reorderProjects = asyncHandler(async (req: Request, res: Response) => {
  const { projectIds } = req.body as { projectIds: string[] };

  if (!Array.isArray(projectIds)) {
    throw new ApiError(400, 'projectIds must be an array of project IDs');
  }

  const updates = projectIds.map((id, index) =>
    Project.findByIdAndUpdate(id, { order: index })
  );

  await Promise.all(updates);

  res.status(200).json({
    success: true,
    message: 'Projects reordered successfully',
  });
});
