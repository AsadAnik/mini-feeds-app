import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://mini-feeds-app.onrender.com/api/v1';

// Render free tier cold-starts can take up to 60 seconds
const TIMEOUT_MS = 60000;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    },
    timeout: TIMEOUT_MS,
});

// Attach Bearer token to every request
api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error reading token for interceptor:', error);
    }
    return config;
}, (error) => Promise.reject(error));

// Unwrap API error messages for cleaner throws
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle Token Expiry (skip for login/register as 401 there means invalid credentials)
        const url = error.config?.url || '';
        const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register');

        if (error.response?.status === 401 && !isAuthRequest) {
            const { useAuthStore } = await import('../store/useAuthStore');
            const { router } = await import('expo-router');

            // Clear local state and token
            await useAuthStore.getState().logout(true);

            // Redirect to login
            router.replace('/(auth)/login');

            return Promise.reject(new Error('Session expired. Please login again.'));
        }

        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('Server is waking up, please try again in a moment.'));
        }

        // Extract the best possible error message from the response
        const message = error.response?.data?.message || error.response?.data?.error || error.response?.data?.details || error.message || 'Something went wrong';

        return Promise.reject(new Error(message));
    }
);
