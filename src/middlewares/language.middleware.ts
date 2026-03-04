import { Request, Response, NextFunction } from 'express';

export const languageMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const acceptLanguage = req.headers['accept-language'];

    let language = 'en';

    if (acceptLanguage) {
        const preferredLang = acceptLanguage.split(',')[0].trim().substring(0, 2).toLowerCase();

        if (['en', 'hi'].includes(preferredLang)) {
            language = preferredLang;
        }
    }

    req.language = language;
    next();
};
