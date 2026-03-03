import { Request, Response, NextFunction } from 'express';
import { ValidatorAdapter } from '../lib/shared';
import { ValidationError } from '../lib/shared/validator/validator.adapter';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware function to validate the incoming request against a provided schema.
 * Supports both wrapped (body/query/params) schemas and flat body schemas.
 */
function validationReq(schema: any) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Determine if the schema is wrapped (expects { body, query, params }) 
            // per our PostValidation pattern.
            const isWrapped = schema && schema.shape &&
                (schema.shape.body || schema.shape.query || schema.shape.params);

            if (isWrapped) {
                const validated: any = ValidatorAdapter.validate(schema, {
                    body: req.body,
                    query: req.query,
                    params: req.params
                });

                // Sanitized data update - Use Object.assign for query/params as they are often read-only getters
                if (validated.body) req.body = validated.body;
                if (validated.query) {
                    Object.assign(req.query as any, validated.query);
                }
                if (validated.params) {
                    Object.assign(req.params as any, validated.params);
                }
            } else {
                // Fallback for flat schemas: validate only req.body
                req.body = ValidatorAdapter.validate(schema, req.body);
            }

            next();

        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: error.name,
                    message: error.message,
                    details: error.details.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message,
                    })),
                });
                return;
            }

            console.error('Validation Middleware Error:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Internal Server Error',
                message: 'An unexpected validation error occurred'
            });
            return;
        }
    };
}

export default validationReq;