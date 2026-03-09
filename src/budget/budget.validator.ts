import { Request, Response, NextFunction } from 'express';
import { apiError } from '../utils/apiResponse';

export const validateSetBudget = (req: Request, res: Response, next: NextFunction) => {
    const { amount, month, categoryId } = req.body;

    if (amount === undefined || amount === null || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json(apiError('Amount must be a number greater than 0'));
    }

    if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        return res.status(400).json(apiError('Month must be in YYYY-MM format'));
    }

    if (categoryId !== undefined && typeof categoryId !== 'string') {
        return res.status(400).json(apiError('Category ID must be a valid string'));
    }

    next();
};

export const validateGetBudgets = (req: Request, res: Response, next: NextFunction) => {
    const { month } = req.query;

    if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month as string)) {
        return res.status(400).json(apiError('Query parameter "month" is required and must be in YYYY-MM format'));
    }

    next();
};
