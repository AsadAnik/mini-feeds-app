import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, Image, StatusBar, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { useNotificationStore } from '@/store/useNotificationStore';
import { BellOff, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AvatarRenderer } from '../profile/components/AvatarRenderer';

// region NOTIFICATION
export function Notification() {
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const { notifications, isLoading, fetchNotifications } = useNotificationStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    const bgColors = theme === 'dark'
        ? (['#000000', '#0f172a'] as const)
        : (['#f8fafc', '#ffffff'] as const);

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={bgColors} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                    <View style={[styles.bellIconWrapper, { backgroundColor: colors.primary + '15' }]}>
                        <Bell size={20} color={colors.primary} />
                    </View>
                </View>

                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                            colors={[colors.primary]}
                        />
                    }
                    ListEmptyComponent={
                        isLoading ? (
                            <View style={styles.emptyContainer}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={[styles.emptyText, { color: colors.textSecondary, marginTop: 16 }]}>Loading activity...</Text>
                            </View>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <BellOff size={60} color={colors.textSecondary} style={{ marginBottom: 20, opacity: 0.5 }} />
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notifications yet</Text>
                                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>When you get notifications, they'll show up here.</Text>
                            </View>
                        )
                    }
                    renderItem={({ item }) => (
                        <View style={[styles.notificationCard, theme === 'dark' ? styles.cardDark : styles.cardLight]}>
                            <View style={styles.avatarWrapper}>
                                {item.avatarConfig ? (
                                    <View style={{ marginRight: 16 }}>
                                        <AvatarRenderer config={item.avatarConfig} size={54} />
                                    </View>
                                ) : (
                                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                                )}
                                <View style={styles.userIndicator} />
                            </View>
                            <View style={styles.content}>
                                <Text style={[styles.message, { color: colors.text }]}>{item.text}</Text>
                                <Text style={[styles.time, { color: colors.textSecondary }]}>{item.time}</Text>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={[styles.list, notifications.length === 0 && { flex: 1, justifyContent: 'center' }]}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </View>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 20,
    },
    headerTitle: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
    bellIconWrapper: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    list: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
    },
    cardLight: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.03)',
    },
    cardDark: { backgroundColor: 'rgba(30, 41, 59, 0.5)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 54, height: 54, borderRadius: 27, marginRight: 16 },
    userIndicator: { position: 'absolute', bottom: 2, right: 18, width: 14, height: 14, borderRadius: 7, backgroundColor: '#6366f1', borderWidth: 2, borderColor: '#FFFFFF' },
    content: { flex: 1 },
    message: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
    time: { fontSize: 13, fontWeight: '500', marginTop: 4, opacity: 0.8 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    emptyText: { fontSize: 20, fontWeight: '800' },
    emptySubtext: { fontSize: 15, textAlign: 'center', marginTop: 8, opacity: 0.7 }
});
