import { Request, Response } from 'express';
import { apiSuccess } from '../utils/apiResponse';
import { t } from '../utils/i18n';

export const checkHealth = (req: Request, res: Response) => {
    const lang = req.language;
    const message = t('APP.HEALTH_OK', lang);

    res.status(200).json(apiSuccess(message));
};
