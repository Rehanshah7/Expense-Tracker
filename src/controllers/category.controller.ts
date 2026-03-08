import { Request, Response } from 'express';
import {
    createCategoryService,
    getCategoriesService,
    updateCategoryService,
    deleteCategoryService
} from '../services/category.services';

import { apiSuccess, apiError } from '../utils/apiResponse';
import { t } from '../utils/i18n';

export const createCategory = async (req: Request, res: Response) => {
    const lang = req.language;

    try {

        const { name, type, icon, color } = req.body;
        const userId = req.user?.id;

        if (!name || name.trim() === '') {
            return res.status(400).json(apiError('Name is required'));
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json(apiError('Type must be income or expense'));
        }

        const category = await createCategoryService({
            userId,
            name: name.trim(),
            type,
            icon,
            color
        });

        res.status(201).json(
            apiSuccess(t('CATEGORY.CATEGORY_CREATED', lang), category)
        );

    } catch (error: any) {

        if (error.message === 'CATEGORY_ALREADY_EXISTS') {
            return res.status(400).json(
                apiError(t('CATEGORY.CATEGORY_ALREADY_EXISTS', lang))
            );
        }

        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const getCategories = async (req: Request, res: Response) => {

    const lang = req.language;

    try {

        const userId = req.user?.id;
        const { type } = req.query;

        const filter: any = { userId };

        if (type && ['income', 'expense'].includes(type as string)) {
            filter.type = type;
        }

        const categories = await getCategoriesService(filter);

        res.status(200).json(
            apiSuccess(t('CATEGORY.CATEGORIES_FETCHED', lang), categories)
        );

    } catch (error: any) {

        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const updateCategory = async (req: Request, res: Response) => {

    const lang = req.language;

    try {

        const { id } = req.params;
        const { name, icon, color } = req.body;
        const userId = req.user?.id;

        const category = await updateCategoryService(id as string, userId, {
            name,
            icon,
            color
        });

        res.status(200).json(
            apiSuccess(t('CATEGORY.CATEGORY_UPDATED', lang), category)
        );

    } catch (error: any) {

        if (error.message === 'CATEGORY_NOT_FOUND') {
            return res.status(404).json(
                apiError(t('CATEGORY.CATEGORY_NOT_FOUND', lang))
            );
        }

        if (error.message === 'CATEGORY_ALREADY_EXISTS') {
            return res.status(400).json(
                apiError(t('CATEGORY.CATEGORY_ALREADY_EXISTS', lang))
            );
        }

        if (error.message === 'UNAUTHORIZED') {
            return res.status(403).json(
                apiError(t('AUTH.UNAUTHORIZED', lang))
            );
        }

        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const deleteCategory = async (req: Request, res: Response) => {

    const lang = req.language;

    try {

        const { id } = req.params;
        const userId = req.user?.id;

        await deleteCategoryService(id as string, userId);

        res.status(200).json(
            apiSuccess(t('CATEGORY.CATEGORY_DELETED', lang))
        );

    } catch (error: any) {

        if (error.message === 'CATEGORY_NOT_FOUND') {
            return res.status(404).json(
                apiError(t('CATEGORY.CATEGORY_NOT_FOUND', lang))
            );
        }

        if (error.message === 'UNAUTHORIZED') {
            return res.status(403).json(
                apiError(t('AUTH.UNAUTHORIZED', lang))
            );
        }

        if (error.message === 'CATEGORY_IN_USE') {
            return res.status(400).json(
                apiError(t('CATEGORY.CATEGORY_IN_USE', lang))
            );
        }

        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};