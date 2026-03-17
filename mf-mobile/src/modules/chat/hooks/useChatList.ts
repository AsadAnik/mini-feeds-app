import { useRef, useEffect, useMemo, useState } from 'react';
import { Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useChatStore } from '@/store/useChatStore';
import { useFriendStore } from '@/store/useFriendStore';

export function useChatList() {
    const router = useRouter();
    const { conversations, fetchConversations, isLoadingConversations, startConversation, deleteConversation } = useChatStore();
    const { friendsList, fetchFriends, isLoadingFriends } = useFriendStore();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchConversations();
        fetchFriends();
    }, []);

    // Merge friends and conversations for a unified listing
    const unifiedList = useMemo(() => {
        const filtered = friendsList.filter(f => 
            f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return filtered.map(friend => {
            const conversation = conversations.find(c => c.otherParticipant.id === friend.id);
            return {
                friend,
                conversation,
                // Sort key: last message time or conversation update time, or 0
                timestamp: conversation ? new Date(conversation.updatedAt).getTime() : 0
            };
        }).sort((a, b) => b.timestamp - a.timestamp || a.friend.fullName.localeCompare(b.friend.fullName));
    }, [friendsList, conversations, searchQuery]);

    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0.8, duration: 4000, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 0.4, duration: 4000, useNativeDriver: true }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [fadeAnim]);

    const handleItemPress = async (item: typeof unifiedList[0]) => {
        if (item.conversation) {
            router.push(`/chat/${item.conversation.id}`);
        } else {
            try {
                const conversation = await startConversation(item.friend.id);
                router.push(`/chat/${conversation.id}`);
            } catch (error) {
                console.error('Failed to start chat:', error);
            }
        }
    };

    const onRefresh = () => {
        fetchConversations();
        fetchFriends();
    };

    return {
        unifiedList,
        isLoading: isLoadingConversations || isLoadingFriends,
        isLoadingFriends,
        searchQuery,
        setSearchQuery,
        fadeAnim,
        handleItemPress,
        onRefresh,
        deleteConversation,
        router
    };
}
