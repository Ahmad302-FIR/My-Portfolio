import { Router } from 'express';
import { uploadProjectScreenshot, uploadProfilePhoto } from '../controllers/uploadController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { uploadImage } from '../middleware/uploadMiddleware';

const router = Router();

// Admin protected image uploads
router.post('/project-image', authenticateAdmin, uploadImage.single('image'), uploadProjectScreenshot);
router.post('/profile-image', authenticateAdmin, uploadImage.single('image'), uploadProfilePhoto);

export default router;
