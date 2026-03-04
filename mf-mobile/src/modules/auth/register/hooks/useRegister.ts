import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export function useRegister() {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const register = useAuthStore((state) => state.register);

    const handleRegister = async () => {
        if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
            setError('All fields are required.');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            await register({
                fullName: fullName.trim(),
                username: username.trim(),
                email: email.trim(),
                password,
            });
            // After successful registration navigate to login
            router.replace('/login');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        fullName,
        setFullName,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        handleRegister,
    };
}
