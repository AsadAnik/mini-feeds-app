import express from 'express';
import { validationReq, AuthMiddleware } from '../middlewares';
import { AuthValidation } from '../utils/validation';
import { AuthController } from '../controllers';

const router = express.Router();

// Object instance for AuthController Class
const authController = new AuthController();

// Auth Routes
router.post('/login', validationReq(AuthValidation.loginUser), authController.login);
router.post('/register', validationReq(AuthValidation.registerUser), authController.register);
router.get('/logout', AuthMiddleware.verifyUser, authController.logout);

export default router;