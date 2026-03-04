import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';

export interface UserProfile {
    id: string;
    email: string;
    fullName: string;
    username: string;
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

    const { logout } = useAuthStore();
    const router = useRouter();

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/users/profile');
            if (response.data?.success) {
                setProfile(response.data.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch profile');
            console.error('Error fetching profile:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

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

    return {
        profile,
        isLoading,
        error,
        fetchProfile,
        handleLogout,
    };
}
