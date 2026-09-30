import { Router } from 'express';
import { uploadResume } from '../controllers/resumeController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { uploadPdf } from '../middleware/uploadMiddleware';

const router = Router();

// Protected admin endpoint for updating resume PDF
router.post('/', authenticateAdmin, uploadPdf.single('resume'), uploadResume);

export default router;
