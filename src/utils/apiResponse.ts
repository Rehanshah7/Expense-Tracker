export interface IApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

export const apiSuccess = <T>(message: string, data?: T): IApiResponse<T> => {
    const response: IApiResponse<T> = { success: true, message };
    if (data !== undefined) {
        response.data = data;
    }
    return response;
};

export const apiError = (message: string, error?: any): IApiResponse<any> => {
    const response: IApiResponse<any> = { success: false, message };
    if (error !== undefined) {
        response.error = error;
    }
    return response;
};
