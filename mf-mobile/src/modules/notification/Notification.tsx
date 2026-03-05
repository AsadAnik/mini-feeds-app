import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, FlatList, Image, StatusBar, RefreshControl, ActivityIndicator } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { useNotificationStore } from '@/store/useNotificationStore';
import { BellOff } from 'lucide-react-native';

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

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
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
                            <Text style={[styles.emptyText, { color: colors.textSecondary, marginTop: 16 }]}>Loading notifications...</Text>
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <BellOff size={48} color={colors.textSecondary} style={{ marginBottom: 16 }} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notifications yet</Text>
                        </View>
                    )
                }
                renderItem={({ item }) => (
                    <View style={[styles.notificationItem, { borderBottomColor: colors.border }]}>
                        <Image source={{ uri: item.avatar }} style={[styles.avatar, { borderColor: colors.surface }]} />
                        <View style={styles.content}>
                            <Text style={[styles.text, { color: colors.text }]}>{item.text}</Text>
                            <Text style={[styles.time, { color: colors.textSecondary }]}>{item.time}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={[styles.list, notifications.length === 0 && { flex: 1, justifyContent: 'center' }]}
            />
        </SafeAreaView>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    list: {
        padding: 20,
        flexGrow: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    text: {
        fontSize: 16,
        color: '#1f2937',
        marginBottom: 4,
    },
    time: {
        fontSize: 13,
        color: '#9ca3af',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
    }
});
