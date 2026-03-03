import { z, ZodError } from 'zod';

// region Validation Adapter
class ZodAdapter {
    /**
     * Validates incoming data against a Zod schema
     * @param schema Zod schema object
     * @param data Data to validate
     * @returns Parsed and validated data
     * @throws ValidationError if validation fails
     */
    static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
        try {
            return schema.parse(data);
            
        } catch (error) {
            if (error instanceof ZodError) {
                throw new ValidationError('Validation failed', error.errors);
            }
            throw error; // Re-throw non-validation errors
        }
    }
}

/**
 * Custom Validation Error
 * @param message
 * @param details
 */
// region Custom Validation Error 
class ValidationError extends Error {
    name: string;
    details: z.ZodIssue[];

    constructor(message: string, details: z.ZodIssue[]) {
        super(message);
        this.name = 'ValidationError';
        this.details = details;
    }
}

export default ZodAdapter;
export { ValidationError };