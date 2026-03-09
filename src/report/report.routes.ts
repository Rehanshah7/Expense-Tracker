import { Router } from 'express';
import {
    getBudgetVsExpenseReport,
    getCategoryTrendReport
} from './report.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protect all report routes
router.use(authMiddleware);

router.get('/budget-vs-expense', getBudgetVsExpenseReport);
router.get('/category-trend', getCategoryTrendReport);

export default router;
