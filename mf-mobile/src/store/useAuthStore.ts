import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export interface User {
    id: string;
    email: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
    avatarConfig?: any;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isHydrating: boolean;
    hasSeenOnboarding: boolean;

    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: (localOnly?: boolean) => Promise<void>;
    checkAuth: () => Promise<void>;
    completeOnboarding: () => Promise<void>;
    updateUserData: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    user: null,
    isHydrating: true,
    hasSeenOnboarding: false,

    // region Login Auth
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data?.success) {
                const { id, email, fullName, username, avatarConfig, accessToken } = response.data.data;

                await AsyncStorage.setItem('@access_token', accessToken);

                const userData = {
                    id,
                    email,
                    fullName,
                    username,
                    avatarConfig,
                    avatarUrl: `https://i.pravatar.cc/150?u=${id}`
                };
                await AsyncStorage.setItem('@user_data', JSON.stringify(userData));

                set({ isAuthenticated: true, user: userData });
            } else {
                throw new Error(response.data?.message || 'Login failed');
            }
        } catch (error: any) {
            // Catch network or API errors properly
            const message = error.response?.data?.error || error.response?.data?.message || error.message;
            throw new Error(message || 'Login failed');
        }
    },

    // region Register Auth
    register: async (data) => {
        try {
            const response = await api.post('/auth/register', data);

            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Registration failed');
            }
        } catch (error: any) {
            const message = error.response?.data?.error || error.response?.data?.message || error.message;
            throw new Error(message || 'Registration failed');
        }
    },

    // region Logout Auth
    logout: async (localOnly: boolean = false) => {
        if (!localOnly) {
            try {
                await api.get('/auth/logout');
            } catch (error) {
                console.log("Logged out failed at server, clearing local storage", error);
            }
        }
        await AsyncStorage.removeItem('@access_token');
        await AsyncStorage.removeItem('@user_data');
        set({ isAuthenticated: false, user: null });
    },

    // region Check Auth
    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem('@access_token');
            const userDataStr = await AsyncStorage.getItem('@user_data');
            const hasSeenOnboardingStr = await AsyncStorage.getItem('@has_seen_onboarding');
            const hasSeenOnboarding = hasSeenOnboardingStr === 'true';

            if (token && userDataStr) {
                set({ isAuthenticated: true, user: JSON.parse(userDataStr), hasSeenOnboarding, isHydrating: false });
            } else {
                set({ isAuthenticated: false, user: null, hasSeenOnboarding, isHydrating: false });
            }
        } catch (e) {
            set({ isAuthenticated: false, user: null, hasSeenOnboarding: false, isHydrating: false });
        }
    },

    // region Complete Onboarding
    completeOnboarding: async () => {
        try {
            await AsyncStorage.setItem('@has_seen_onboarding', 'true');
            set({ hasSeenOnboarding: true });
        } catch (e) {
            console.error('Failed to set onboarding status', e);
        }
    },

    // region Update User
    updateUserData: async (data: Partial<User>) => {
        try {
            const currentUser = get().user;
            if (!currentUser) return;

            const updatedUser = { ...currentUser, ...data };
            await AsyncStorage.setItem('@user_data', JSON.stringify(updatedUser));
            set({ user: updatedUser });
        } catch (e) {
            console.error('Failed to update user data in storage', e);
        }
    }
}));
