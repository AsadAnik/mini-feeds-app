import { Response, Request, NextFunction } from 'express';

/**
 * ==== Not Found ====
 * @param {express.Request} req 
 * @param {express.Response} _res 
 * @param {express.NextFunction} next 
 */
// region Not Found Handle
const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    (error as any).status = 404;
    next(error);
};

/**
 * ==== Error Handler ====
 * @param {Error} error 
 * @param {express.Request} _req 
 * @param {express.Response} res 
 * @returns 
 */
// region Error Handle
const errorHandlerMiddleware = (error: any, _req: Request, res: Response | any) => {
    console.log('I am here who is responsible for error handling');
    const status = (error as any).status || 500;
    const message = error.message || "Something went wrong!";
    return res.status(status).json({ message });
};

export { notFoundMiddleware, errorHandlerMiddleware };