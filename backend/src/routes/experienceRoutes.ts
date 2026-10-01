import { Router } from 'express';
import {
  getPublicExperiences,
  getAdminExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
  experienceValidationSchema,
} from '../controllers/experienceController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';

const router = Router();

// Public route: active experiences only
router.get('/', getPublicExperiences);

// Admin routes
router.get('/admin', authenticateAdmin, getAdminExperiences);
router.post('/admin', authenticateAdmin, validate(experienceValidationSchema), createExperience);
router.put('/admin/reorder', authenticateAdmin, reorderExperiences);
router.put('/admin/:id', authenticateAdmin, validate(experienceValidationSchema.partial()), updateExperience);
router.delete('/admin/:id', authenticateAdmin, deleteExperience);

export default router;
