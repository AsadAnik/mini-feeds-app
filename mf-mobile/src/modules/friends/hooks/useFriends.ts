import { useEffect, useState } from 'react';
import { useFriendStore } from '@/store/useFriendStore';

export function useFriends(activeTab: 'explore' | 'friends' | 'requests', searchQuery: string) {
    const {
        exploreList,
        friendsList,
        requestsList,
        isLoadingExplore,
        isLoadingFriends,
        isLoadingRequests,
        actionLoading,
        fetchExplore,
        fetchFriends,
        fetchRequests,
        sendRequest,
        acceptRequest,
        rejectRequest,
        removeFriend,
    } = useFriendStore();

    // Fetch data whenever the tab or search query changes
    useEffect(() => {
        const query = searchQuery.trim() || undefined;

        if (activeTab === 'explore') {
            fetchExplore(query);
        } else if (activeTab === 'friends') {
            fetchFriends(query);
        } else if (activeTab === 'requests') {
            fetchRequests();
        }
    }, [activeTab, searchQuery]);

    const currentList = activeTab === 'explore'
        ? exploreList
        : activeTab === 'friends'
            ? friendsList
            : requestsList;

    const isLoading = activeTab === 'explore'
        ? isLoadingExplore
        : activeTab === 'friends'
            ? isLoadingFriends
            : isLoadingRequests;

    return {
        currentList,
        requestsList,
        isLoading,
        actionLoading,
        sendRequest,
        acceptRequest,
        rejectRequest,
        removeFriend,
    };
}
