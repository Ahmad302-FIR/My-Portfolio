import { Router } from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  toggleFeatured,
  reorderProjects,
  projectSchema,
  updateProjectSchema,
} from '../controllers/projectController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';

const router = Router();

// Public routes
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

// Admin protected routes
router.post('/', authenticateAdmin, validate(projectSchema), createProject);
router.put('/:id', authenticateAdmin, validate(updateProjectSchema), updateProject);
router.delete('/:id', authenticateAdmin, deleteProject);
router.patch('/:id/featured', authenticateAdmin, toggleFeatured);
router.patch('/reorder', authenticateAdmin, reorderProjects);

export default router;
