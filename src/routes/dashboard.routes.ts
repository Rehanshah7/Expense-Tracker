import { Router } from 'express';
import {
    getDashboardSummary,
    getMonthlySummary,
    getCategorySummary,
    getRecentTransactions
} from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protect all dashboard routes
router.use(authMiddleware);

router.get('/summary', getDashboardSummary);
router.get('/month-summary', getMonthlySummary);
router.get('/category-summary', getCategorySummary);
router.get('/recent', getRecentTransactions);

export default router;
