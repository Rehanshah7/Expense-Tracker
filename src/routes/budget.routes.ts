import { Router } from 'express';
import {
    setBudget,
    getBudgets
} from '../controllers/budget.controller';
import {
    validateSetBudget,
    validateGetBudgets
} from '../validators/budget.validator';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protect all budget routes
router.use(authMiddleware);

router.post('/', validateSetBudget, setBudget);
router.get('/', validateGetBudgets, getBudgets);

export default router;
