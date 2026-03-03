import { z } from 'zod';

class AuthValidation {
  /**
   * REGISTER USER SCHEMA
   */
  // region Register Validation
  static registerUser = z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    })
  });


  /**
   * LOGIN USER SCHEMA
   */
  // region Login Validation
  static loginUser = z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    })
  });
}

export default AuthValidation;