import { useState } from 'react';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';
import { useFeedStore } from '@/store/useFeedStore';
import { useAuthStore } from '@/store/useAuthStore';

export function useCreatePost() {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const addPostLocally = useFeedStore((state) => state.addPostLocally);
    const user = useAuthStore((state) => state.user);

    const avatarUri = `https://i.pravatar.cc/150?u=${user?.id ?? 'default'}`;
    const charCount = content.length;
    const isOverLimit = charCount > 250;
    const canSubmit = content.trim().length > 0 && !isSubmitting && !isOverLimit;

    const handleSubmit = async () => {
        const trimmed = content.trim();
        if (!trimmed) return;

        setError(null);
        setIsSubmitting(true);

        try {
            const response = await api.post('/posts', { content: trimmed });

            if (response.data?.success) {
                const newPost = response.data.data;

                // Optimistically prepend into the feed immediately
                addPostLocally({
                    ...newPost,
                    _count: { likes: 0, comments: 0 },
                    isLikedByMe: false,
                });

                setContent('');
                router.replace('/(tabs)');
            }
        } catch (err: any) {
            setError(err.message || 'Could not create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return {
        content,
        setContent,
        isSubmitting,
        error,
        canSubmit,
        charCount,
        isOverLimit,
        user,
        avatarUri,
        handleSubmit,
        handleCancel,
    };
}
