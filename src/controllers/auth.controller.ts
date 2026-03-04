import { Request, Response } from 'express';
import { registerUser, loginUser, googleLogin } from '../services/auth.services';
import { apiSuccess, apiError } from '../utils/apiResponse';
import { t } from '../utils/i18n';

export const register = async (req: Request, res: Response) => {
    const lang = req.language;
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json(apiError(t('AUTH.INVALID_CREDENTIALS', lang)));
            return;
        }

        const result = await registerUser({ name, email, password });

        const userObj = result.user.toObject();
        delete userObj.password;

        res.status(201).json(
            apiSuccess(t('AUTH.REGISTER_SUCCESS', lang), {
                user: userObj,
                token: result.token,
            })
        );
    } catch (error: any) {
        if (error.message === 'USER_EXISTS') {
            res.status(400).json(apiError(t('AUTH.USER_EXISTS', lang)));
        } else {
            res.status(500).json(apiError(t('AUTH.SERVER_ERROR', lang), error.message));
        }
    }
};

export const login = async (req: Request, res: Response) => {
    const lang = req.language;
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json(apiError(t('AUTH.INVALID_CREDENTIALS', lang)));
            return;
        }

        const result = await loginUser({ email, password });

        res.status(200).json(
            apiSuccess(t('AUTH.LOGIN_SUCCESS', lang), {
                user: result.user,
                token: result.token,
            })
        );
    } catch (error: any) {
        if (error.message === 'INVALID_CREDENTIALS') {
            res.status(401).json(apiError(t('AUTH.INVALID_CREDENTIALS', lang)));
        } else {
            res.status(500).json(apiError(t('AUTH.SERVER_ERROR', lang), error.message));
        }
    }
};

export const googleAuth = async (req: Request, res: Response) => {
    const lang = req.language;
    try {
        const { idToken } = req.body;

        if (!idToken) {
            res.status(400).json(apiError(t('AUTH.INVALID_CREDENTIALS', lang)));
            return;
        }

        const result = await googleLogin(idToken);

        res.status(200).json(
            apiSuccess(t('AUTH.LOGIN_SUCCESS', lang), {
                user: result.user,
                token: result.token,
            })
        );
    } catch (error: any) {
        if (error.message === 'INVALID_GOOGLE_TOKEN') {
            res.status(401).json(apiError(t('AUTH.INVALID_CREDENTIALS', lang)));
        } else {
            res.status(500).json(apiError(t('AUTH.SERVER_ERROR', lang), error.message));
        }
    }
};
