import { Request, Response, NextFunction } from 'express';
import { apiError } from '../utils/apiResponse';
import { TransactionType, PaymentMethod } from './transaction.model';

export const validateCreateTransaction = (req: Request, res: Response, next: NextFunction) => {
    const { amount, type, categoryId, date, paymentMethod } = req.body;

    if (amount === undefined || amount === null || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json(apiError('Amount must be a number greater than 0'));
    }

    if (!Object.values(TransactionType).includes(type)) {
        return res.status(400).json(apiError('Type must be income or expense'));
    }

    if (!categoryId || typeof categoryId !== 'string') {
        return res.status(400).json(apiError('Category ID is required'));
    }

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json(apiError('Valid date is required'));
    }

    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
        return res.status(400).json(apiError('Invalid payment method'));
    }

    next();
};

export const validateUpdateTransaction = (req: Request, res: Response, next: NextFunction) => {
    const { amount, type, categoryId, date, paymentMethod } = req.body;

    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
        return res.status(400).json(apiError('Amount must be a number greater than 0'));
    }

    if (type !== undefined && !Object.values(TransactionType).includes(type)) {
        return res.status(400).json(apiError('Type must be income or expense'));
    }

    if (categoryId !== undefined && typeof categoryId !== 'string') {
        return res.status(400).json(apiError('Category ID must be a valid string'));
    }

    if (date !== undefined && isNaN(Date.parse(date))) {
        return res.status(400).json(apiError('Valid date is required'));
    }

    if (paymentMethod !== undefined && !Object.values(PaymentMethod).includes(paymentMethod)) {
        return res.status(400).json(apiError('Invalid payment method'));
    }

    next();
};

export const validateTransactionFilters = (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate, page, limit } = req.query;

    if (startDate && isNaN(Date.parse(startDate as string))) {
        return res.status(400).json(apiError('Invalid startDate format'));
    }

    if (endDate && isNaN(Date.parse(endDate as string))) {
        return res.status(400).json(apiError('Invalid endDate format'));
    }

    if (page && (isNaN(Number(page)) || Number(page) < 1)) {
        return res.status(400).json(apiError('Page must be a positive integer'));
    }

    if (limit && (isNaN(Number(limit)) || Number(limit) < 1)) {
        return res.status(400).json(apiError('Limit must be a positive integer'));
    }

    next();
};
