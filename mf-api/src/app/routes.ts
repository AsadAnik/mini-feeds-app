import { Router, Request, Response, NextFunction } from 'express';
import { authRoutes } from '../routes';
// import { AuthMiddleware } from '../middlewares';

const router: Router = Router();

/**
 * ---- Routes For API Version 01 -----
 * All required routes root
 */
router.use('/api/v1/auth', authRoutes);

/**
 * ---- Health Check for the application here ----
 * Checking for Health of application at very first time
 */
router.get('/health', (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
        message: 'Successful',
        data: {
            message: 'Server is up and running...'
        }
    });
});

export default router;