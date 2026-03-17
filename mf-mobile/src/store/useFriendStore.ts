import { create } from 'zustand';
import { api } from '../services/api';

// region Interfaces
export interface FriendUser {
    id: string;
    fullName: string;
    username: string;
    email: string;
    avatar?: string;
    avatarConfig?: any;
    mutual?: number;
}

export interface FriendRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: string;
    createdAt: string;
    sender: FriendUser;
}

interface FriendState {
    // State
    exploreList: FriendUser[];
    friendsList: FriendUser[];
    requestsList: FriendRequest[];
    isLoadingExplore: boolean;
    isLoadingFriends: boolean;
    isLoadingRequests: boolean;
    actionLoading: string | null;

    // Actions
    fetchExplore: (query?: string) => Promise<void>;
    fetchFriends: (query?: string) => Promise<void>;
    fetchRequests: () => Promise<void>;
    sendRequest: (receiverId: string) => Promise<void>;
    acceptRequest: (requestId: string) => Promise<void>;
    rejectRequest: (requestId: string) => Promise<void>;
    removeFriend: (friendId: string) => Promise<void>;
}

export const useFriendStore = create<FriendState>((set, get) => ({
    exploreList: [],
    friendsList: [],
    requestsList: [],
    isLoadingExplore: false,
    isLoadingFriends: false,
    isLoadingRequests: false,
    actionLoading: null,

    // region Fetch Explore
    fetchExplore: async (query?: string) => {
        set({ isLoadingExplore: true });
        try {
            const response = await api.get('/friends/explore', { params: { q: query } });
            const exploreList = response.data.data.map((p: any) => ({
                ...p,
                avatarConfig: typeof p.avatarConfig === 'string' ? JSON.parse(p.avatarConfig) : p.avatarConfig
            }));
            set({ exploreList });
        } catch (error) {
            console.error('Error fetching explore list:', error);
        } finally {
            set({ isLoadingExplore: false });
        }
    },

    // region Fetch Friends
    fetchFriends: async (query?: string) => {
        set({ isLoadingFriends: true });
        try {
            const response = await api.get('/friends', { params: { q: query } });
            const friendsList = response.data.data.map((f: any) => ({
                ...f,
                avatarConfig: typeof f.avatarConfig === 'string' ? JSON.parse(f.avatarConfig) : f.avatarConfig
            }));
            set({ friendsList });
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            set({ isLoadingFriends: false });
        }
    },

    // region Fetch Pending Requests
    fetchRequests: async () => {
        set({ isLoadingRequests: true });
        try {
            const response = await api.get('/friends/requests');
            const requestsList = response.data.data.map((r: any) => ({
                ...r,
                sender: {
                    ...r.sender,
                    avatarConfig: typeof r.sender?.avatarConfig === 'string' ? JSON.parse(r.sender.avatarConfig) : r.sender?.avatarConfig
                }
            }));
            set({ requestsList });
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        } finally {
            set({ isLoadingRequests: false });
        }
    },

    // region Send Friend Request
    sendRequest: async (receiverId: string) => {
        set({ actionLoading: receiverId });
        try {
            await api.post('/friends/request', { receiverId });
            // Optimistically remove from explore list
            set((state) => ({
                exploreList: state.exploreList.filter((p) => p.id !== receiverId),
            }));
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error;
        } finally {
            set({ actionLoading: null });
        }
    },

    // region Accept Friend Request
    acceptRequest: async (requestId: string) => {
        set({ actionLoading: requestId });
        try {
            await api.post(`/friends/request/${requestId}/accept`);
            // Optimistically remove from requests and reload friends
            const acceptedReq = get().requestsList.find((r) => r.id === requestId);
            set((state) => ({
                requestsList: state.requestsList.filter((r) => r.id !== requestId),
            }));
            if (acceptedReq) {
                // Add to friends list optimistically
                set((state) => ({
                    friendsList: [acceptedReq.sender, ...state.friendsList],
                }));
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
            throw error;
        } finally {
            set({ actionLoading: null });
        }
    },

    // region Reject Friend Request
    rejectRequest: async (requestId: string) => {
        set({ actionLoading: requestId });
        try {
            await api.post(`/friends/request/${requestId}/reject`);
            set((state) => ({
                requestsList: state.requestsList.filter((r) => r.id !== requestId),
            }));
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            throw error;
        } finally {
            set({ actionLoading: null });
        }
    },

    // region Remove Friend
    removeFriend: async (friendId: string) => {
        set({ actionLoading: friendId });
        try {
            await api.delete(`/friends/${friendId}`);
            set((state) => ({
                friendsList: state.friendsList.filter((f) => f.id !== friendId),
            }));
        } catch (error) {
            console.error('Error removing friend:', error);
            throw error;
        } finally {
            set({ actionLoading: null });
        }
    },
}));
