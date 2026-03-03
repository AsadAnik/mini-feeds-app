import { Request, Response, NextFunction } from 'express';
import { ValidatorAdapter } from '../lib/shared';
import { ValidationError } from '../lib/shared/validator/validator.adapter';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware function to validate the incoming request body against a provided schema.
 * It modifies the request body to match the validated and sanitized data or returns an error response if validation fails.
 * @param {any} schema - The validation schema to be used for validating the request body.
 * @return {function} Middleware function that validates the request and either proceeds to the next middleware or sends an error response.
 */
function validationReq(schema: any) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.body = ValidatorAdapter.validate(schema, req.body);
            next();

        } catch (error) {
            if (error instanceof ValidationError) {
                // Send validation error response
                res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.name,
                    message: error.message,
                    details: error.details.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message,
                    })),
                });
                return;
            }

            // Handle unexpected errors
            console.error('Unexpected Error:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Internal Server Error',
                message: 'An unexpected error occurred',
            });
        }
    };
}

export default validationReq;