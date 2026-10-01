import { Router } from 'express';
import { getPublicPortfolio } from '../controllers/portfolioController';

const router = Router();

// GET /api/portfolio (single public endpoint)
router.get('/', getPublicPortfolio);

export default router;
