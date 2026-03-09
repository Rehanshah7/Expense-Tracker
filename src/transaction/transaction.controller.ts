import { Request, Response } from 'express';
import {
    createTransactionService,
    getTransactionsService,
    getTransactionByIdService,
    updateTransactionService,
    deleteTransactionService
} from './transaction.service';
import { apiSuccess, apiError } from '../utils/apiResponse';
import { t } from '../utils/i18n';

export const createTransaction = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;
        const transactionPayload = { ...req.body, userId };

        const transaction = await createTransactionService(transactionPayload);

        res.status(201).json(
            apiSuccess(t('TRANSACTION.TRANSACTION_CREATED', lang), transaction)
        );
    } catch (error: any) {
        if (error.message === 'CATEGORY_NOT_FOUND') {
            return res.status(404).json(
                apiError(t('CATEGORY.CATEGORY_NOT_FOUND', lang))
            );
        }

        if (error.message === 'UNAUTHORIZED_CATEGORY_ACCESS') {
            return res.status(403).json(
                apiError(t('AUTH.UNAUTHORIZED', lang))
            );
        }

        if (error.message === 'INVALID_TRANSACTION_TYPE') {
            return res.status(400).json(
                apiError(t('TRANSACTION.INVALID_TRANSACTION_TYPE', lang))
            );
        }

        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;
        const { startDate, endDate, categoryId, type, page, limit } = req.query;

        const filters = {
            userId: userId as string,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            categoryId: categoryId as string,
            type: type as string,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined
        };

        const result = await getTransactionsService(filters);

        res.status(200).json(
            apiSuccess(t('TRANSACTION.TRANSACTION_FETCHED', lang), result)
        );
    } catch (error: any) {
        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const getTransactionById = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const transaction = await getTransactionByIdService(id as string, userId);

        res.status(200).json(
            apiSuccess(t('TRANSACTION.TRANSACTION_FETCHED', lang), transaction)
        );
    } catch (error: any) {
        if (error.message === 'TRANSACTION_NOT_FOUND') {
            return res.status(404).json(
                apiError(t('TRANSACTION.TRANSACTION_NOT_FOUND', lang))
            );
        }

        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const updateTransaction = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const updateData = req.body;

        const transaction = await updateTransactionService(id as string, userId, updateData);

        res.status(200).json(
            apiSuccess(t('TRANSACTION.TRANSACTION_UPDATED', lang), transaction)
        );
    } catch (error: any) {
        if (error.message === 'TRANSACTION_NOT_FOUND') {
            return res.status(404).json(
                apiError(t('TRANSACTION.TRANSACTION_NOT_FOUND', lang))
            );
        }

        if (error.message === 'CATEGORY_NOT_FOUND') {
            return res.status(404).json(
                apiError(t('CATEGORY.CATEGORY_NOT_FOUND', lang))
            );
        }

         if (error.message === 'UNAUTHORIZED_CATEGORY_ACCESS') {
            return res.status(403).json(
                apiError(t('AUTH.UNAUTHORIZED', lang))
            );
        }

        if (error.message === 'INVALID_TRANSACTION_TYPE') {
            return res.status(400).json(
                apiError(t('TRANSACTION.INVALID_TRANSACTION_TYPE', lang))
            );
        }

        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const deleteTransaction = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const { id } = req.params;
        const userId = req.user?.id;

        await deleteTransactionService(id as string, userId);

        res.status(200).json(
            apiSuccess(t('TRANSACTION.TRANSACTION_DELETED', lang))
        );
    } catch (error: any) {
        if (error.message === 'TRANSACTION_NOT_FOUND') {
            return res.status(404).json(
                apiError(t('TRANSACTION.TRANSACTION_NOT_FOUND', lang))
            );
        }

        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};
