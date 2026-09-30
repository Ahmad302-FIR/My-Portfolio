import { Router } from 'express';
import { getSettings, updateSettings, updateSettingsSchema } from '../controllers/settingsController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';

const router = Router();

// Public route to fetch portfolio display settings
router.get('/', getSettings);

// Admin protected route to update settings
router.put('/', authenticateAdmin, validate(updateSettingsSchema), updateSettings);

export default router;
