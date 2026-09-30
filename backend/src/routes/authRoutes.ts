import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, getMe, logout, changePassword, loginSchema, changePasswordSchema } from '../controllers/authController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { ENV } from '../config/env';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: ENV.NODE_ENV === 'development' ? 50 : 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, validate(loginSchema), login);
router.get('/me', authenticateAdmin, getMe);
router.post('/logout', authenticateAdmin, logout);
router.patch('/change-password', authenticateAdmin, validate(changePasswordSchema), changePassword);

export default router;
