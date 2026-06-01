export interface HttpError extends Error {
    statusCode: number;
}

export function httpError(message: string, statusCode: number): HttpError {
    const error = new Error(message) as HttpError;
    error.statusCode = statusCode;
    return error;
}
