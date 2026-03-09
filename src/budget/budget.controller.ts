import { Request, Response } from 'express';
import {
    setBudgetService,
    getBudgetsWithProgressService
} from './budget.service';
import { apiSuccess, apiError } from '../utils/apiResponse';
import { t } from '../utils/i18n';

export const setBudget = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;
        const payload = { ...req.body, userId };

        const budget = await setBudgetService(payload);

        res.status(200).json(
            apiSuccess(t('BUDGET.BUDGET_SET_SUCCESS', lang), budget)
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

        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const getBudgets = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;
        const { month } = req.query; // YYYY-MM

        const data = await getBudgetsWithProgressService(userId as string, month as string);

        res.status(200).json(
            apiSuccess(t('BUDGET.BUDGET_FETCHED', lang), data)
        );
    } catch (error: any) {
        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};
