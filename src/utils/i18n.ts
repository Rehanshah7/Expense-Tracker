import en from '../locales/en.json';
import hi from '../locales/hi.json';

const translations: Record<string, any> = {
    en,
    hi,
};

export const t = (key: string, lang: string = 'en'): string => {
    const dictionary = translations[lang] || translations['en'];

    const keys = key.split('.');
    let result = dictionary;

    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            let fallbackResult = translations['en'];
            for (const fk of keys) {
                if (fallbackResult && typeof fallbackResult === 'object' && fk in fallbackResult) {
                    fallbackResult = fallbackResult[fk];
                } else {
                    return key;
                }
            }
            return fallbackResult as unknown as string;
        }
    }

    return result as unknown as string;
};
