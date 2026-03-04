import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../../store/useAuthStore';

export function useLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Email and password are required.');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            await login({ email: email.trim(), password });
            router.replace('/(tabs)');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        handleLogin,
    };
}
