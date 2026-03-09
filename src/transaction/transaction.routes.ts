import { Router } from 'express';
import {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} from './transaction.controller';
import {
    validateCreateTransaction,
    validateUpdateTransaction,
    validateTransactionFilters
} from './transaction.validator';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protect all transaction routes
router.use(authMiddleware);

router.post('/', validateCreateTransaction, createTransaction);
router.get('/', validateTransactionFilters, getTransactions);
router.get('/:id', getTransactionById);
router.put('/:id', validateUpdateTransaction, updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
