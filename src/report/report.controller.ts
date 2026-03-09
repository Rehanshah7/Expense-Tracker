import { Request, Response } from 'express';
import {
    getBudgetVsExpenseReportService,
    getCategoryTrendReportService
} from './report.service';
import { apiSuccess, apiError } from '../utils/apiResponse';
import { t } from '../utils/i18n';

export const getBudgetVsExpenseReport = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;
        const { month } = req.query;

        if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month as string)) {
            return res.status(400).json(apiError('Query parameter "month" is required and must be in YYYY-MM format'));
        }

        const data = await getBudgetVsExpenseReportService(userId as string, month as string);

        res.status(200).json(
            apiSuccess(t('REPORT.BUDGET_VS_EXPENSE_FETCHED', lang), data)
        );
    } catch (error: any) {
        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const getCategoryTrendReport = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;

        const data = await getCategoryTrendReportService(userId as string);

        res.status(200).json(
            apiSuccess(t('REPORT.CATEGORY_TREND_FETCHED', lang), data)
        );
    } catch (error: any) {
        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};
