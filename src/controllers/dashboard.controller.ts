import { Request, Response } from 'express';
import {
    getDashboardSummaryService,
    getMonthlySummaryService,
    getCategorySummaryService,
    getRecentTransactionsService
} from '../services/dashboard.service';
import { apiSuccess, apiError } from '../utils/apiResponse';
import { t } from '../utils/i18n';

export const getDashboardSummary = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;
        
        if(!userId) {
            return res.status(401).json(apiError(t('AUTH.UNAUTHORIZED', lang)));
        }

        const data = await getDashboardSummaryService(userId);

        res.status(200).json(
            apiSuccess(t('DASHBOARD.DASHBOARD_DATA_FETCHED', lang), data)
        );
    } catch (error: any) {
        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const getMonthlySummary = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;

        if(!userId) {
            return res.status(401).json(apiError(t('AUTH.UNAUTHORIZED', lang)));
        }

        const data = await getMonthlySummaryService(userId);

        res.status(200).json(
            apiSuccess(t('DASHBOARD.MONTHLY_SUMMARY_FETCHED', lang), data)
        );
    } catch (error: any) {
        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const getCategorySummary = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;

        if(!userId) {
            return res.status(401).json(apiError(t('AUTH.UNAUTHORIZED', lang)));
        }

        const data = await getCategorySummaryService(userId);

        res.status(200).json(
            apiSuccess(t('DASHBOARD.CATEGORY_SUMMARY_FETCHED', lang), data)
        );
    } catch (error: any) {
        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const getRecentTransactions = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;

        if(!userId) {
            return res.status(401).json(apiError(t('AUTH.UNAUTHORIZED', lang)));
        }

        const data = await getRecentTransactionsService(userId, 5);

        res.status(200).json(
            apiSuccess(t('DASHBOARD.RECENT_TRANSACTIONS_FETCHED', lang), data)
        );
    } catch (error: any) {
        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};
