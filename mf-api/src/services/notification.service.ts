import admin from '../lib/firebase';
import PrismaClient from '../prisma';

class NotificationService {
    /**
     * Save notification to database
     * @param userId Recipient user ID
     * @param senderId Sender user ID
     * @param type Notification type
     * @param content Notification content
     * @param postId Related post ID
     */
    // region Save Notification
    public async saveNotificationToDatabase(userId: string, senderId: string, type: string, content: string, postId?: string) {
        try {
            await PrismaClient.notification.create({
                data: {
                    userId,
                    senderId,
                    type,
                    content,
                    postId,
                }
            });
        } catch (error) {
            console.error('Error saving notification to DB:', error);
        }
    }

    /**
     * Send a push notification to a specific user
     * @param token FCM token of the recipient
     * @param title Title of the notification
     * @param body Body of the notification
     * @param data Optional data payload
     */
    // region Send Push Notification
    public async sendPushNotification(token: string, title: string, body: string, data?: any) {
        if (!admin.apps.length || !token) {
            return;
        }

        const message = {
            notification: {
                title,
                body,
            },
            token,
            data: data || {},
        };

        try {
            const response = await admin.messaging().send(message);
            console.log('Successfully sent message:', response);
            return response;
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    /**
     * Update FCM token for a user
     * @param userId User ID
     * @param fcmToken FCM token
     * @returns 
     */
    // region Update FCM Token
    public async updateFcmToken(userId: string, fcmToken: string) {
        try {
            await PrismaClient.user.update({
                where: { id: userId },
                data: { fcmToken }
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating FCM token:', error);
            throw error;
        }
    }
}

export default new NotificationService();
