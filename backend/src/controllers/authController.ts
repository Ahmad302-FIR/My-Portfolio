import { Request, Response } from 'express';
import { z } from 'zod';
import { Admin } from '../models/Admin';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { generateToken, setAuthCookie, clearAuthCookie } from '../utils/generateToken';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { logActivity } from '../services/activityService';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!admin) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  const token = generateToken({
    id: admin._id.toString(),
    email: admin.email,
    role: admin.role,
  });

  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
      token,
    },
  });
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const admin = req.admin!;
  res.status(200).json({
    success: true,
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.admin!._id;

  const admin = await Admin.findById(adminId).select('+password');
  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  if (currentPassword === newPassword) {
    throw new ApiError(400, 'New password cannot be the same as your current password');
  }

  admin.password = newPassword;
  await admin.save();

  await logActivity('password_changed', 'Admin password changed');

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});
