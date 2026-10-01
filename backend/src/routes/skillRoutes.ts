import { Router } from 'express';
import {
  getPublicSkills,
  getAdminSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  skillValidationSchema,
  reorderSkillsSchema,
} from '../controllers/skillController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';

const router = Router();

// Public route: active skills only
router.get('/', getPublicSkills);

// Admin routes
router.get('/admin', authenticateAdmin, getAdminSkills);
router.post('/admin', authenticateAdmin, validate(skillValidationSchema), createSkill);
router.put('/admin/reorder', authenticateAdmin, validate(reorderSkillsSchema), reorderSkills);
router.put('/admin/:id', authenticateAdmin, validate(skillValidationSchema.partial()), updateSkill);
router.delete('/admin/:id', authenticateAdmin, deleteSkill);

export default router;
