import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, FlatList, Image, StatusBar } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';

const mockNotifications = [
    { id: '1', type: 'like', text: 'Jane Smith liked your post.', time: '2h ago', avatar: 'https://i.pravatar.cc/150?u=b042581f4e29026704d' },
    { id: '2', type: 'comment', text: 'Mike Developer commented on your post.', time: '1d ago', avatar: 'https://i.pravatar.cc/150?u=c042581f4e29026704d' },
];

// region NOTIFICATION
export function Notification() {
    const { theme } = useThemeStore();
    const colors = Colors[theme];

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
            </View>
            <FlatList
                data={mockNotifications}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.notificationItem, { borderBottomColor: colors.border }]}>
                        <Image source={{ uri: item.avatar }} style={[styles.avatar, { borderColor: colors.surface }]} />
                        <View style={styles.content}>
                            <Text style={[styles.text, { color: colors.text }]}>{item.text}</Text>
                            <Text style={[styles.time, { color: colors.textSecondary }]}>{item.time}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.list}
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
    }
});
