import { create } from 'zustand';
import { api } from '@/services/api';
import { timeAgo } from '@/utils/date';

export interface INotification {
    id: string;
    type: 'like' | 'comment';
    text: string;
    time: string;
    avatar?: string;
    avatarConfig?: any;
    postId?: string;
    createdAt: Date;
    isRead: boolean;
}

interface NotificationState {
    notifications: INotification[];
    isLoading: boolean;
    addNotification: (notification: Omit<INotification, 'id' | 'createdAt' | 'time' | 'isRead'>) => void;
    fetchNotifications: () => Promise<void>;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    isLoading: false,
    addNotification: (notification) => set((state) => {
        const newNotification: INotification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            time: 'Just now',
            isRead: false,
            avatar: notification.avatar || `https://i.pravatar.cc/150?u=${Math.random()}`,
            avatarConfig: (notification as any).avatarConfig
        };
        return {
            notifications: [newNotification, ...state.notifications]
        };
    }),
    fetchNotifications: async () => {
        if (get().isLoading) return;
        set({ isLoading: true });
        try {
            const response = await api.get('/users/notifications');
            const mappedNotifications: INotification[] = response.data.data.map((n: any) => ({
                id: n.id,
                type: n.type,
                text: n.content,
                time: timeAgo(n.createdAt),
                createdAt: new Date(n.createdAt),
                isRead: n.isRead,
                postId: n.postId,
                avatar: `https://i.pravatar.cc/150?u=${n.senderId}`,
                avatarConfig: n.sender?.avatarConfig
            }));
            set({ notifications: mappedNotifications });
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            set({ isLoading: false });
        }
    },
    clearNotifications: () => set({ notifications: [] }),
}));
