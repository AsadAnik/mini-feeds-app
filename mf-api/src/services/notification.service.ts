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
}

export default new NotificationService();
