import { useState, useEffect, useMemo } from 'react';
import { useFeedStore } from '@/store/useFeedStore';
import NotificationService from '@/services/notificationService';

export function useHome() {
    const {
        posts,
        isLoadingPosts,
        isFetchingMore,
        fetchPosts,
        fetchMorePosts,
        searchQuery,
        setSearchQuery,
    } = useFeedStore();

    const [refreshing, setRefreshing] = useState(false);

    // region Notifications setup
    useEffect(() => {
        const setupNotifications = async () => {
            const token = await NotificationService.registerForPushNotificationsAsync();
            if (token) {
                await NotificationService.updateTokenOnBackend(token);
            }
        };

        setupNotifications();
        const cleanup = NotificationService.addNotificationListeners();
        return cleanup;
    }, []);

    // Fetch first page on mount
    useEffect(() => {
        fetchPosts(1, true);
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPosts(1, true);
        setRefreshing(false);
    };

    // Client-side filter while the user types
    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) return posts;
        const q = searchQuery.toLowerCase();
        return posts.filter(
            (post) =>
                post.author?.email?.toLowerCase().includes(q) ||
                post.author?.username?.toLowerCase().includes(q) ||
                post.author?.fullName?.toLowerCase().includes(q)
        );
    }, [posts, searchQuery]);

    const handleEndReached = () => {
        // Disable infinite scroll while a search query is active
        if (!searchQuery) fetchMorePosts();
    };

    return {
        filteredPosts,
        searchQuery,
        setSearchQuery,
        isLoadingPosts,
        isFetchingMore,
        refreshing,
        onRefresh,
        handleEndReached,
        totalPosts: posts.length,
    };
}
