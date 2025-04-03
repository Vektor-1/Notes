interface ResponseData {
    [key: string]: any;
}

export const sendResponse = (
    res: { status: (statusCode: number) => { json: (body: object) => void } },
    status: number,
    data: ResponseData,
    message: string = ''
): void => {
    res.status(status).json({
        message,
        data,
    });
};
  
interface ErrorResponse {
    message: string;
    error: any;
}

export const sendError = (
    res: { status: (statusCode: number) => { json: (body: ErrorResponse) => void } },
    status: number,
    error: any
): void => {
    res.status(status).json({
        message: 'Error',
        error,
    });
};
  