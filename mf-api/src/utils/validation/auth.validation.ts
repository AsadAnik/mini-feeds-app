import { z } from 'zod';

class AuthValidation {
  /**
   * REGISTER USER SCHEMA
   */
  // region Register Validation
  static registerUser = z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      fullName: z.string().min(2, 'Full name is required'),
      username: z.string().min(3, 'Username must be at least 3 characters'),
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