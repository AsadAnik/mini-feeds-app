/**
 * Custom Error Class
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param isOperational - Whether the error is operational
 * @param stack - Stack trace
 */
export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
