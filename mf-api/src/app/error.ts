import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * ==== Not Found ====
 * @param {express.Request} req 
 * @param {express.Response} _res 
 * @param {express.NextFunction} next 
 */
// region Not Found Handle
const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    (error as any).statusCode = StatusCodes.NOT_FOUND;
    next(error);
};

/**
 * ==== Error Handler ====
 * Express error handling middleware must have 4 parameters.
 * @param {any} error 
 * @param {express.Request} _req 
 * @param {express.Response} res 
 * @param {express.NextFunction} _next
 */
// region Error Handle
const errorHandlerMiddleware = (error: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error handled by middleware:', error.message);

    const statusCode = error.statusCode || error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || "Something went wrong!";

    return res.status(statusCode).json({
        success: false,
        message,
        // Only show stack trace in development
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
};

export { notFoundMiddleware, errorHandlerMiddleware };