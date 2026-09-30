import fs from 'fs';
import path from 'path';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary';
import { ENV } from '../config/env';
import { ApiError } from '../utils/ApiError';

export interface UploadResult {
  url: string;
  publicId: string;
}

export const uploadProjectImage = async (
  file: Express.Multer.File
): Promise<UploadResult> => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio/projects',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  if (ENV.NODE_ENV === 'production') {
    throw new ApiError(500, 'Cloudinary storage is required in production. Please configure Cloudinary environment variables.');
  }

  // Local storage fallback for development
  const uploadsDir = path.resolve(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const extension = path.extname(file.originalname) || '.jpg';
  const fileName = `project_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${extension}`;
  const filePath = path.join(uploadsDir, fileName);

  fs.writeFileSync(filePath, file.buffer);

  return {
    url: `/uploads/${fileName}`,
    publicId: `local_${fileName}`,
  };
};

export const uploadResumePdf = async (
  file: Express.Multer.File
): Promise<UploadResult> => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio/resume',
          resource_type: 'raw',
          format: 'pdf',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary resume upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  if (ENV.NODE_ENV === 'production') {
    throw new ApiError(500, 'Cloudinary storage is required in production. Please configure Cloudinary environment variables.');
  }

  // Local storage fallback for development
  const uploadsDir = path.resolve(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `resume_${Date.now()}.pdf`;
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, file.buffer);

  return {
    url: `/uploads/${fileName}`,
    publicId: `local_${fileName}`,
  };
};

export const uploadProfileImage = async (
  file: Express.Multer.File
): Promise<UploadResult> => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio/profile',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary profile upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  if (ENV.NODE_ENV === 'production') {
    throw new ApiError(500, 'Cloudinary storage is required in production. Please configure Cloudinary environment variables.');
  }

  const uploadsDir = path.resolve(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const extension = path.extname(file.originalname) || '.jpg';
  const fileName = `profile_${Date.now()}${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, file.buffer);

  return {
    url: `/uploads/${fileName}`,
    publicId: `local_${fileName}`,
  };
};

export const deleteCloudinaryAsset = async (
  publicId: string,
  resourceType: 'image' | 'raw' = 'image'
): Promise<void> => {
  if (!publicId) return;

  if (publicId.startsWith('local_')) {
    const fileName = publicId.replace('local_', '');
    const filePath = path.resolve(__dirname, '../../uploads', fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to delete local fallback asset:', err);
      }
    }
    return;
  }

  if (isCloudinaryConfigured) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (err) {
      console.error('Failed to delete asset from Cloudinary:', err);
    }
  }
};
