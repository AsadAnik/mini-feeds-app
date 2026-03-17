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

    /**
     * UPDATE FCM TOKEN
     * @param req 
     * @param res 
     * @returns 
     */
    public updateFcmToken = async (req: Request | any, res: Response) => {
        try {
            const { fcmToken } = req.body;
            const userId = req.user.id;

            if (!fcmToken) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'FCM token is required'
                });
            }

            await this.userService.updateFcmToken(userId, fcmToken);

            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'FCM token updated successfully'
            });
        } catch (error: any) {
            console.error('Error in UserController.updateFcmToken:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error occurred while updating FCM token'
            });
        }
    }

    /**
     * UPDATE USER PROFILE
     * @param req 
     * @param res 
     * @returns 
     */
    public updateProfile = async (req: Request | any, res: Response) => {
        try {
            const { fullName, avatarConfig } = req.body;
            const userId = req.user.id;

            const updatedUser = await this.userService.updateProfile(userId, { fullName, avatarConfig });

            // Remove sensitive information
            const { password, ...userProfile } = updatedUser;

            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Profile updated successfully',
                data: userProfile
            });
        } catch (error: any) {
            console.error('Error in UserController.updateProfile:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error occurred while updating profile'
            });
        }
    }

    /**
     * GET NOTIFICATIONS
     * @param req 
     * @param res 
     * @returns 
     */
    public getNotifications = async (req: Request | any, res: Response) => {
        try {
            const userId = req.user.id;
            const notifications = await this.userService.getUserNotifications(userId);

            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Notifications retrieved successfully',
                data: notifications
            });
        } catch (error: any) {
            console.error('Error in UserController.getNotifications:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error occurred while retrieving notifications'
            });
        }
    }
    /**
     * CHANGE PASSWORD
     * @param req 
     * @param res 
     * @returns 
     */
    public changePassword = async (req: Request | any, res: Response) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user.id;

            if (!oldPassword || !newPassword) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Old and new passwords are required'
                });
            }

            await this.userService.changePassword(userId, oldPassword, newPassword);

            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error: any) {
            console.error('Error in UserController.changePassword:', error);
            return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error occurred while changing password'
            });
        }
    }
}

export default UserController;
