import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { getActivityLogs } from '../controllers/activityController';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Admin dashboard routes
router.get('/dashboard', authenticateAdmin, getDashboardStats);
router.get('/activity', authenticateAdmin, getActivityLogs);

export default router;
