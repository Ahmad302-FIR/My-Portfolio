import { Router } from 'express';
import { uploadResume, getResumeFile } from '../controllers/resumeController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { uploadPdf } from '../middleware/uploadMiddleware';

const router = Router();

// Public endpoint to stream/view/download current resume PDF
router.get('/', getResumeFile);
router.get('/file', getResumeFile);

// Protected admin endpoint for updating resume PDF
router.post('/', authenticateAdmin, uploadPdf.single('resume'), uploadResume);

export default router;
