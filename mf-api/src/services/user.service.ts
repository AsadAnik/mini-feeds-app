import { BcryptLib } from '../lib/shared';
import PrismaClient from '../prisma';
import { ApiError } from '../utils/errors/ApiError';
import { StatusCodes } from 'http-status-codes';

class UserService {
    /**
     * An asynchronous function to find a user by their unique identifier.
     * @param {string} id - The unique identifier of the user to be retrieved.
     */
    // region FIND USER
    public findUser = async (id: string) => {
        try {
            const user = await PrismaClient.user.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            posts: true,
                            comments: true,
                            likes: true
                        }
                    }
                }
            });
            if (!user) {
                throw new ApiError(StatusCodes.NOT_FOUND, `User not found for id: ${id}`);
            }
            return user;

        } catch (error) {
            console.error(`Error to find user: ${error}`);
            throw error;
        }
    }

    /**
     * Update user's FCM token
     * @param userId 
     * @param fcmToken 
     */
    // region UPDATE FCM TOKEN
    public async updateFcmToken(userId: string, fcmToken: string) {
        try {
            return await PrismaClient.user.update({
                where: { id: userId },
                data: { fcmToken }
            });
        } catch (error) {
            console.error('Error in updateFcmToken service:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     * @param userId 
     * @param data 
     * @returns 
     */
    // region UPDATE PROFILE
    public async updateProfile(userId: string, data: { fullName?: string, avatarConfig?: any }) {
        try {
            return await PrismaClient.user.update({
                where: { id: userId },
                data: {
                    ...data
                }
            });
        } catch (error) {
            console.error('Error in updateProfile service:', error);
            throw error;
        }
    }

    /**
     * Get user notifications
     * @param userId 
     * @returns 
     */
    // region Get NOTIFICATION
    public async getUserNotifications(userId: string) {
        try {
            return await PrismaClient.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
                        select: {
                            id: true,
                            fullName: true,
                            username: true,
                            avatarConfig: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error in getUserNotifications service:', error);
            throw error;
        }
    }

    /**
     * Change user password
     * @param userId 
     * @param oldPassword 
     * @param newPassword 
     */
    // region CHANGE PASWORD
    public async changePassword(userId: string, oldPassword: string, newPassword: string) {
        try {
            const user = await PrismaClient.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
            }

            const bcryptLib = new BcryptLib();
            const isMatch = await bcryptLib.comparePassword(oldPassword, user.password);
            if (!isMatch) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Current password does not match');
            }

            const hashedNewPassword = await bcryptLib.hashPassword(newPassword);

            return await PrismaClient.user.update({
                where: { id: userId },
                data: { password: hashedNewPassword }
            });
        } catch (error) {
            console.error('Error in changePassword service:', error);
            throw error;
        }
    }
}

export default UserService;