import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, FlatList, Image } from 'react-native';

const mockNotifications = [
    { id: '1', type: 'like', text: 'Jane Smith liked your post.', time: '2h ago', avatar: 'https://i.pravatar.cc/150?u=b042581f4e29026704d' },
    { id: '2', type: 'comment', text: 'Mike Developer commented on your post.', time: '1d ago', avatar: 'https://i.pravatar.cc/150?u=c042581f4e29026704d' },
];

export function Notification() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <FlatList
                data={mockNotifications}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <View style={styles.content}>
                            <Text style={styles.text}>{item.text}</Text>
                            <Text style={styles.time}>{item.time}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? 30 : 0
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
