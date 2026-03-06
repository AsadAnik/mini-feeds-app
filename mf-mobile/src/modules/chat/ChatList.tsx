import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
    Animated,
    Image,
    TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, Edit } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';

const MOCK_CHATS = [
    { id: '1', name: 'Sarah Parker', message: 'Hey, are we still on for today?', time: '2m', unread: 2, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Alex Johnson', message: 'Sent an attachment', time: '1h', unread: 0, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Jessica Alba', message: 'Thanks for the help! 🙏', time: '2h', unread: 1, avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'Michael Chen', message: 'Let me check on that and get back to you.', time: '5h', unread: 0, avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', name: 'Emily Davis', message: 'See you tomorrow!', time: '1d', unread: 0, avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: '6', name: 'David Smith', message: 'Can you send the file again?', time: '2d', unread: 0, avatar: 'https://i.pravatar.cc/150?u=6' },
];

const ACTIVE_USERS = MOCK_CHATS.slice(0, 5);

// region CHAT LIST
export function ChatList() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const colors = Colors[theme];

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

    const renderActiveUser = ({ item }: { item: typeof ACTIVE_USERS[0] }) => (
        <TouchableOpacity style={styles.activeUserContainer} activeOpacity={0.7} onPress={() => router.push(`/chat/${item.id}`)}>
            <LinearGradient
                colors={['#818cf8', '#c084fc']}
                style={styles.activeUserGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
                <View style={[styles.activeUserInner, { backgroundColor: colors.background }]}>
                    <Image source={{ uri: item.avatar }} style={styles.activeUserAvatar} />
                </View>
            </LinearGradient>
            <View style={[styles.onlineDot, { backgroundColor: '#22c55e', borderColor: colors.background }]} />
            <Text style={[styles.activeUserName, { color: colors.text }]} numberOfLines={1}>{item.name.split(' ')[0]}</Text>
        </TouchableOpacity>
    );

    const renderChatItem = ({ item, index }: { item: typeof MOCK_CHATS[0], index: number }) => {
        return (
            <TouchableOpacity
                style={[styles.chatItem, index === MOCK_CHATS.length - 1 && { borderBottomWidth: 0 }]}
                activeOpacity={0.7}
                onPress={() => router.push(`/chat/${item.id}`)}
            >
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
                    {index % 3 === 0 && <View style={[styles.onlineDotSmall, { borderColor: colors.background }]} />}
                </View>

                <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                        <Text style={[styles.chatName, { color: colors.text }]}>{item.name}</Text>
                        <Text style={[styles.chatTime, { color: item.unread > 0 ? colors.primary : colors.textSecondary }]}>{item.time}</Text>
                    </View>
                    <View style={styles.chatFooter}>
                        <Text
                            style={[
                                styles.chatMessage,
                                { color: item.unread > 0 ? colors.text : colors.textSecondary },
                                item.unread > 0 && { fontWeight: '600' }
                            ]}
                            numberOfLines={1}
                        >
                            {item.message}
                        </Text>
                        {item.unread > 0 && (
                            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.unreadText}>{item.unread}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
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
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
                        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                            <Edit size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <View style={[styles.searchInputWrapper, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                            <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
                            <TextInput
                                style={[styles.searchInput, { color: colors.text }]}
                                placeholder="Search messages or people..."
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>
                    </View>

                    {/* List content */}
                    <FlatList
                        data={MOCK_CHATS}
                        keyExtractor={item => item.id}
                        renderItem={renderChatItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        ListHeaderComponent={
                            <View style={styles.activeUsersSection}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Now</Text>
                                <FlatList
                                    horizontal
                                    data={ACTIVE_USERS}
                                    keyExtractor={item => item.id}
                                    renderItem={renderActiveUser}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.activeUsersList}
                                />
                            </View>
                        }
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
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
    listContent: {
        paddingBottom: 40,
    },
    activeUsersSection: {
        marginBottom: 20,
        paddingTop: 5,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        paddingHorizontal: 20,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        opacity: 0.6,
    },
    activeUsersList: {
        paddingHorizontal: 15,
    },
    activeUserContainer: {
        alignItems: 'center',
        marginHorizontal: 8,
        position: 'relative',
    },
    activeUserGradient: {
        width: 66,
        height: 66,
        borderRadius: 33,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeUserInner: {
        width: '100%',
        height: '100%',
        borderRadius: 31,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    activeUserAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 29,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 22,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
    },
    activeUserName: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderRadius: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 15,
    },
    chatAvatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
    },
    onlineDotSmall: {
        position: 'absolute',
        bottom: 0,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#22c55e',
        borderWidth: 2,
    },
    chatInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '700',
    },
    chatTime: {
        fontSize: 12,
        fontWeight: '500',
    },
    chatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatMessage: {
        flex: 1,
        fontSize: 14,
        marginRight: 10,
    },
    unreadBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
    },
});
