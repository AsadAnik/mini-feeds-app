import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';

export interface UserProfile {
    id: string;
    email: string;
    fullName: string;
    username: string;
    avatarConfig?: any;
    createdAt: string;
    updatedAt: string;
    _count: {
        posts: number;
        comments: number;
        likes: number;
    };
}

export function useProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { logout, updateUserData } = useAuthStore();
    const router = useRouter();

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/users/profile');
            if (response.data?.success) {
                setProfile(response.data.data);
                // Also update local store just in case it's out of sync
                updateUserData(response.data.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch profile');
            console.error('Error fetching profile:', err);
        } finally {
            setIsLoading(false);
        }
    }, [updateUserData]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const updateProfile = useCallback(async (data: { fullName?: string, avatarConfig?: any }) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.put('/users/profile', data);
            if (response.data?.success) {
                const updatedData = response.data.data;
                setProfile(updatedData);
                // Sync with auth store
                await updateUserData(updatedData);
                return { success: true, data: updatedData };
            }
            return { success: false, message: 'Failed to update profile' };
        } catch (err: any) {
            const msg = err.message || 'Failed to update profile';
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setIsLoading(false);
        }
    }, [updateUserData]);

    return {
        profile,
        isLoading,
        error,
        fetchProfile,
        handleLogout,
        updateProfile,
    };
}
