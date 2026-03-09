import { Request, Response } from 'express';
import {
    getNotificationsService,
    markNotificationAsReadService
} from './notification.service';
import { apiSuccess, apiError } from '../utils/apiResponse';
import { t } from '../utils/i18n';

export const getNotifications = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;

        const data = await getNotificationsService(userId as string);

        res.status(200).json(
            apiSuccess(t('NOTIFICATION.NOTIFICATIONS_FETCHED', lang), data)
        );
    } catch (error: any) {
        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    const lang = req.language as string;

    try {
        const userId = req.user?.id;
        const { id } = req.params;

        const notification = await markNotificationAsReadService(id as string, userId as string);

        if (!notification) {
             return res.status(404).json(
                apiError(t('NOTIFICATION.NOTIFICATION_NOT_FOUND', lang))
            );
        }

        res.status(200).json(
            apiSuccess(t('NOTIFICATION.NOTIFICATION_READ', lang), notification)
        );
    } catch (error: any) {
        res.status(500).json(
            apiError(t('AUTH.SERVER_ERROR', lang), error.message)
        );
    }
};
