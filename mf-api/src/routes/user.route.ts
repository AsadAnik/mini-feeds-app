import { Router } from 'express';
import { UserController } from '../controllers';
import AuthMiddleware from '../middlewares/auth.middleware';

const router: Router = Router();
const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and management
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
// region GET - /users/profile
router.get('/profile', AuthMiddleware.verifyUser, userController.getProfile);

export default router;
