declare global {
    namespace Express {
        interface Request {
            language: string;
            user?: any;
        }
    }
}

export { };
