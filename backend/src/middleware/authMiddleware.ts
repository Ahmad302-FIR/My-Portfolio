import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { Admin, IAdmin } from '../models/Admin';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export interface AuthenticatedRequest extends Request {
  admin?: IAdmin;
}

export const authenticateAdmin = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Check cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Authentication required. Please log in.');
    }

    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; email: string; role: string };
      const admin = await Admin.findById(decoded.id).select('-password');

      if (!admin) {
        throw new ApiError(401, 'User no longer exists. Please log in again.');
      }

      req.admin = admin;
      next();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(401, 'Invalid or expired session. Please log in again.');
    }
  }
);
