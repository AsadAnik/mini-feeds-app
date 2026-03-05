import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from './api';
import { useNotificationStore } from '@/store/useNotificationStore';

// Config notifications behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

class NotificationService {
    /**
     * Request permissions and get the FCM token
     */
    public async registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.warn('Failed to get push token for push notification!');
                return;
            }

            try {
                const projectId =
                    Constants?.expoConfig?.extra?.eas?.projectId ??
                    Constants?.easConfig?.projectId;

                token = (await Notifications.getExpoPushTokenAsync({
                    projectId,
                })).data;
                console.log('FCM/Expo Token:', token);
            } catch (e) {
                console.error('Error getting push token:', e);
            }
        } else {
            console.warn('Must use physical device for Push Notifications');
        }

        return token;
    }

    /**
     * Update the FCM token on the backend
     * @param fcmToken 
     */
    public async updateTokenOnBackend(fcmToken: string) {
        try {
            await api.post('/users/fcm-token', { fcmToken });
            console.log('FCM token updated on backend');
        } catch (error) {
            console.error('Error updating FCM token on backend:', error);
        }
    }

    /**
     * Listen for incoming notifications
     */
    public addNotificationListeners() {
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);

            const { title, body } = notification.request.content;
            const data = notification.request.content.data as { postId?: string, type?: string };

            useNotificationStore.getState().addNotification({
                text: body || title || 'New notification',
                type: (data?.type as 'like' | 'comment') || 'like',
                postId: data?.postId,
            });
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification response received:', response);
            // Handle navigation or other actions when user taps notification
            const data = response.notification.request.content.data as { postId?: string };
            const postId = data?.postId;
            if (postId) {
                // Potential navigation here if navigation is available
            }
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }
}

const notificationServiceInstance = new NotificationService();
export default notificationServiceInstance;
