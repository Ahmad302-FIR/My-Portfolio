import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  sendMessage,
  getMessages,
  getMessageById,
  markAsRead,
  deleteMessage,
  createMessageSchema,
} from '../controllers/messageController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { ENV } from '../config/env';

const router = Router();

// Rate limiting for public message submission: 5 messages per 15 mins in production, higher in dev
const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: ENV.NODE_ENV === 'development' ? 50 : 5,
  message: {
    success: false,
    message: 'Too many messages sent from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public route
router.post('/', messageLimiter, validate(createMessageSchema), sendMessage);

// Admin protected routes
router.get('/', authenticateAdmin, getMessages);
router.get('/:id', authenticateAdmin, getMessageById);
router.patch('/:id/read', authenticateAdmin, markAsRead);
router.delete('/:id', authenticateAdmin, deleteMessage);

export default router;
