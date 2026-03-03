import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services';

class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * GET USER PROFILE
     * @param req 
     * @param res 
     * @returns 
     */
    public getProfile = async (req: Request | any, res: Response) => {
        try {
            // User is already attached to req.user by AuthMiddleware.verifyUser
            const user = req.user;

            // Remove sensitive information if needed (Prisma usually returns everything)
            const { password, ...userProfile } = user;

            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'User profile retrieved successfully',
                data: userProfile
            });
        } catch (error: any) {
            console.error('Error in UserController.getProfile:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error occurred while retrieving user profile'
            });
        }
    }
}

export default UserController;
