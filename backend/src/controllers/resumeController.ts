import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PortfolioSettings } from '../models/PortfolioSettings';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadResumePdf, deleteCloudinaryAsset } from '../services/cloudinaryService';
import { logActivity } from '../services/activityService';

/**
 * Public endpoint to stream and display the resume PDF
 * GET /api/resume or GET /api/admin/resume/file
 */
export const getResumeFile = asyncHandler(async (req: Request, res: Response) => {
  const settings = await PortfolioSettings.findOne().select('+resumeData');

  const isDownload = req.query.download === 'true' || req.query.download === '1';

  // 1. Check if stored directly in MongoDB Atlas buffer
  if (settings && settings.resumeData && settings.resumeData.length > 0) {
    const filename = settings.resumeFileName || 'Muhammad-Ahmed-Resume.pdf';
    res.setHeader('Content-Type', settings.resumeContentType || 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      isDownload ? `attachment; filename="${filename}"` : `inline; filename="${filename}"`
    );
    res.setHeader('Cache-Control', 'public, max-age=600');
    return res.send(settings.resumeData);
  }

  // 2. Fallback to candidate file paths on disk
  const candidatePaths = [
    path.resolve(__dirname, '../../uploads/Muhammad-Ahmed-Resume.pdf'),
    path.resolve(__dirname, '../../uploads/resume.pdf'),
    path.resolve(__dirname, '../../../frontend/public/Muhammad-Ahmed-Resume.pdf'),
    path.resolve(__dirname, '../../../frontend/public/resume.pdf'),
  ];

  for (const candidatePath of candidatePaths) {
    if (fs.existsSync(candidatePath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        isDownload
          ? 'attachment; filename="Muhammad-Ahmed-Resume.pdf"'
          : 'inline; filename="Muhammad-Ahmed-Resume.pdf"'
      );
      return res.sendFile(candidatePath);
    }
  }

  throw new ApiError(404, 'Resume file not found on server.');
});

/**
 * Upload and update the resume PDF
 * POST /api/admin/resume
 */
export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'Please select a PDF resume file to upload');
  }

  // Ensure file is PDF
  const isPdf =
    req.file.mimetype === 'application/pdf' ||
    req.file.originalname.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    throw new ApiError(400, 'Invalid file type. Only PDF documents are allowed.');
  }

  let settings = await PortfolioSettings.findOne();
  if (!settings) {
    settings = await PortfolioSettings.create({});
  }

  // 1. Persist directly in MongoDB Atlas
  settings.resumeData = req.file.buffer;
  settings.resumeContentType = req.file.mimetype || 'application/pdf';
  settings.resumeFileName = req.file.originalname || 'Muhammad-Ahmed-Resume.pdf';

  // 2. Also save to local uploads directory for fast fallback in dev (safely ignored in serverless)
  try {
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadsDir, 'Muhammad-Ahmed-Resume.pdf'), req.file.buffer);

    // Sync to frontend/public if directory is accessible
    const frontendPublicDir = path.resolve(__dirname, '../../../frontend/public');
    if (fs.existsSync(frontendPublicDir)) {
      fs.writeFileSync(path.join(frontendPublicDir, 'Muhammad-Ahmed-Resume.pdf'), req.file.buffer);
      fs.writeFileSync(path.join(frontendPublicDir, 'resume.pdf'), req.file.buffer);
    }
  } catch (fsErr) {
    // Read-only filesystem in serverless environments (Vercel) is normal and safe
  }

  // 3. Delete previous Cloudinary asset if present
  if (settings.resumePublicId) {
    try {
      await deleteCloudinaryAsset(settings.resumePublicId, 'raw');
    } catch (err) {
      console.warn('Could not delete old Cloudinary asset:', err);
    }
  }

  // 4. Also upload to Cloudinary for cloud backup
  try {
    const uploadResult = await uploadResumePdf(req.file);
    settings.resumePublicId = uploadResult.publicId;
  } catch (err) {
    console.warn('Cloudinary upload warning (MongoDB/local backup used):', err);
  }

  // Use the dependable, unblocked API route
  settings.resumeUrl = '/api/resume';
  await settings.save();

  await logActivity('resume_updated', 'Updated portfolio resume PDF');

  res.status(200).json({
    success: true,
    data: {
      resumeUrl: settings.resumeUrl,
      resumePublicId: settings.resumePublicId,
    },
    message: 'Resume updated successfully.',
  });
});
