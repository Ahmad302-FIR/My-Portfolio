import { Request, Response } from 'express';
import { PortfolioSettings } from '../models/PortfolioSettings';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadResumePdf, deleteCloudinaryAsset } from '../services/cloudinaryService';
import { logActivity } from '../services/activityService';

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

  // If old resume had a publicId, delete previous asset
  if (settings.resumePublicId) {
    await deleteCloudinaryAsset(settings.resumePublicId, 'raw');
  }

  const uploadResult = await uploadResumePdf(req.file);

  settings.resumeUrl = uploadResult.url;
  settings.resumePublicId = uploadResult.publicId;
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
