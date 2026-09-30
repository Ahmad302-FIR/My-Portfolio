import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadProjectImage, uploadProfileImage } from '../services/cloudinaryService';

export const uploadProjectScreenshot = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'Please select an image file to upload');
  }

  const result = await uploadProjectImage(req.file);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const uploadProfilePhoto = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'Please select an image file to upload');
  }

  const result = await uploadProfileImage(req.file);

  res.status(200).json({
    success: true,
    data: result,
  });
});
