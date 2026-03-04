import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { apiError } from '../utils/apiResponse';
import { t } from '../utils/i18n';
import { User } from '../models/user.model';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const lang = req.language;
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json(apiError(t('AUTH.MISSING_TOKEN', lang)));
            return;
        }

        const token = authHeader.split(' ')[1];

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in env');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401).json(apiError(t('AUTH.UNAUTHORIZED', lang)));
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json(apiError(t('AUTH.INVALID_TOKEN', lang)));
    }
};
