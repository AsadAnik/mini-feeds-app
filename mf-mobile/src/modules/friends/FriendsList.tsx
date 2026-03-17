import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Platform,
    StatusBar,
    Animated,
    Image,
    TextInput,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { ChevronLeft, Search, UserPlus, UserMinus, UserCheck, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { FriendUser, FriendRequest } from '@/store/useFriendStore';
import { useFriends } from './hooks/useFriends';

import { AvatarRenderer } from '../profile/components/AvatarRenderer';

// region FRIENDS LIST
export function FriendsList() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const colors = Colors[theme];

    const [activeTab, setActiveTab] = useState<'explore' | 'friends' | 'requests'>('explore');
    const [searchQuery, setSearchQuery] = useState('');

    const {
        currentList,
        requestsList,
        isLoading,
        actionLoading,
        sendRequest,
        acceptRequest,
        rejectRequest,
        removeFriend,
        handleRefresh
    } = useFriends(activeTab, searchQuery);

    const bgColors1 = theme === 'dark'
        ? (['#0f172a', '#1e1b4b', '#000000'] as const)
        : (['#f8fafc', '#e2e8f0', '#ffffff'] as const);

    const bgColors2 = theme === 'dark'
        ? (['#1e1b4b', '#000000', '#0f172a'] as const)
        : (['#ffffff', '#f1f5f9', '#f8fafc'] as const);

    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0.8, duration: 4000, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 0.4, duration: 4000, useNativeDriver: true }),
            ])
        ).start();
    }, [fadeAnim]);

    const renderPersonItem = ({ item }: { item: FriendUser }) => {
        const isActionLoading = actionLoading === item.id;
        return (
            <View style={[styles.personItem, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
                {item.avatarConfig ? (
                    <View style={{ marginRight: 14 }}>
                        <AvatarRenderer config={item.avatarConfig} size={50} />
                    </View>
                ) : (
                    <Image source={{ uri: item.avatar || `https://ui-avatars.com/api/?name=${item.fullName}` }} style={styles.personAvatar} />
                )}
                <View style={styles.personInfo}>
                    <Text style={[styles.personName, { color: colors.text }]} numberOfLines={1}>{item.fullName}</Text>
                    <Text style={[styles.personDesc, { color: colors.textSecondary }]} numberOfLines={1}>@{item.username}</Text>
                    {item.mutual ? (
                        <Text style={[styles.personMutual, { color: colors.textSecondary }]}>{item.mutual} mutual friends</Text>
                    ) : null}
                </View>
                {activeTab === 'explore' ? (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.primary, opacity: isActionLoading ? 0.7 : 1 }]}
                        onPress={() => sendRequest(item.id)}
                        disabled={isActionLoading}
                    >
                        {isActionLoading ? <ActivityIndicator size="small" color="#fff" /> : <UserPlus size={16} color="#ffffff" strokeWidth={2.5} />}
                        <Text style={styles.actionButtonText}>Add</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButtonOutline, { borderColor: colors.border, opacity: isActionLoading ? 0.7 : 1 }]}
                        onPress={() => removeFriend(item.id)}
                        disabled={isActionLoading}
                    >
                        {isActionLoading ? <ActivityIndicator size="small" color={colors.textSecondary} /> : <UserMinus size={16} color={colors.textSecondary} strokeWidth={2} />}
                        <Text style={[styles.actionButtonTextOutline, { color: colors.textSecondary }]}>Unfriend</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderRequestItem = ({ item }: { item: FriendRequest }) => {
        const isActionLoading = actionLoading === item.id;
        return (
            <View style={[styles.personItem, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
                {(item.sender.avatarConfig && (typeof item.sender.avatarConfig === 'object' || typeof item.sender.avatarConfig === 'string')) ? (
                    <View style={{ marginRight: 14 }}>
                        <AvatarRenderer config={item.sender.avatarConfig} size={50} />
                    </View>
                ) : (
                    <Image source={{ uri: item.sender.avatar || `https://ui-avatars.com/api/?name=${item.sender.fullName}` }} style={styles.personAvatar} />
                )}
                <View style={styles.personInfo}>
                    <Text style={[styles.personName, { color: colors.text }]} numberOfLines={1}>{item.sender.fullName}</Text>
                    <Text style={[styles.personDesc, { color: colors.textSecondary }]} numberOfLines={1}>@{item.sender.username}</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                        style={[styles.approveButton, { backgroundColor: colors.primary, opacity: isActionLoading ? 0.7 : 1 }]}
                        onPress={() => acceptRequest(item.id)}
                        disabled={isActionLoading}
                    >
                        {isActionLoading ? <ActivityIndicator size="small" color="#fff" /> : <UserCheck size={16} color="#ffffff" strokeWidth={2.5} />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.rejectButton, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', opacity: isActionLoading ? 0.7 : 1 }]}
                        onPress={() => rejectRequest(item.id)}
                        disabled={isActionLoading}
                    >
                        {isActionLoading ? <ActivityIndicator size="small" color={colors.text} /> : <X size={16} color={colors.textSecondary} strokeWidth={2.5} />}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    // region Main UI
    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Animated Background */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient colors={bgColors1} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                    <LinearGradient colors={bgColors2} style={StyleSheet.absoluteFill} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} />
                </Animated.View>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]} onPress={() => router.back()}>
                            <ChevronLeft size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Friends</Text>
                        <View style={{ width: 44 }} />
                    </View>

                    {/* Search Bar */}
                    {activeTab !== 'requests' && (
                        <View style={styles.searchContainer}>
                            <View style={[styles.searchInputWrapper, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                                <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
                                <TextInput
                                    style={[styles.searchInput, { color: colors.text }]}
                                    placeholder="Search by name or username..."
                                    placeholderTextColor={colors.textSecondary}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>
                        </View>
                    )}

                    {/* Tabs Options */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === 'explore' ? [styles.activeTab, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }] : null
                            ]}
                            onPress={() => setActiveTab('explore')}
                        >
                            <Text style={[styles.tabText, { color: activeTab === 'explore' ? colors.text : colors.textSecondary }, activeTab === 'explore' && styles.activeTabText]}>
                                Explore
                            </Text>
                            {activeTab === 'explore' && <View style={[styles.activeTabIndicator, { backgroundColor: colors.primary }]} />}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === 'requests' ? [styles.activeTab, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }] : null
                            ]}
                            onPress={() => setActiveTab('requests')}
                        >
                            <Text style={[styles.tabText, { color: activeTab === 'requests' ? colors.text : colors.textSecondary }, activeTab === 'requests' && styles.activeTabText]}>
                                Requests {requestsList.length > 0 ? `(${requestsList.length})` : ''}
                            </Text>
                            {activeTab === 'requests' && <View style={[styles.activeTabIndicator, { backgroundColor: colors.primary }]} />}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === 'friends' ? [styles.activeTab, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }] : null
                            ]}
                            onPress={() => setActiveTab('friends')}
                        >
                            <Text style={[styles.tabText, { color: activeTab === 'friends' ? colors.text : colors.textSecondary }, activeTab === 'friends' && styles.activeTabText]}>
                                Friends
                            </Text>
                            {activeTab === 'friends' && <View style={[styles.activeTabIndicator, { backgroundColor: colors.primary }]} />}
                        </TouchableOpacity>
                    </View>

                    {/* List content */}
                    {isLoading && currentList.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={currentList as any[]}
                            keyExtractor={item => item.id}
                            renderItem={(info: any) => {
                                if (activeTab === 'requests') return renderRequestItem(info);
                                return renderPersonItem(info);
                            }}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                            initialNumToRender={10}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isLoading}
                                    onRefresh={handleRefresh}
                                    tintColor={colors.primary}
                                />
                            }
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Search size={48} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 15 }} />
                                    <Text style={[styles.emptyText, { color: colors.text }]}>No results found.</Text>
                                    <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
                                        {activeTab === 'requests' ? "You don't have any pending requests." : "Try searching for a different name."}
                                    </Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 46,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        height: '100%',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    tab: {
        flex: 1,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        marginHorizontal: 5,
        position: 'relative',
    },
    activeTab: {

    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    activeTabText: {
        fontWeight: '800',
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: 6,
        width: 20,
        height: 3,
        borderRadius: 1.5,
    },
    listContent: {
        paddingBottom: 40,
        paddingHorizontal: 16,
    },
    personItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(150,150,150,0.1)'
    },
    personAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 14,
    },
    personInfo: {
        flex: 1,
        marginRight: 10,
    },
    personName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    personDesc: {
        fontSize: 13,
        marginBottom: 2,
    },
    personMutual: {
        fontSize: 11,
        fontWeight: '500',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        minWidth: 80,
        justifyContent: 'center'
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 6,
    },
    actionButtonOutline: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1.5,
        minWidth: 90,
        justifyContent: 'center'
    },
    actionButtonTextOutline: {
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 6,
    },
    approveButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
    }
});
