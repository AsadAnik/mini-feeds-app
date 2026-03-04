import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { LogOut, Moon, Sun, ChevronRight } from 'lucide-react-native';
import { useProfile } from './hooks/useProfile';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';

// region PROFILE
export function Profile() {
    const { profile, isLoading, error, fetchProfile, handleLogout } = useProfile();
    const { theme, toggleTheme } = useThemeStore();
    const [refreshing, setRefreshing] = React.useState(false);
    const colors = Colors[theme];

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchProfile();
        setRefreshing(false);
    }, [fetchProfile]);

    if (isLoading && !refreshing && !profile) {
        return (
            <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    if (error && !profile) {
        return (
            <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
                <TouchableOpacity onPress={fetchProfile} style={[styles.retryBtn, { backgroundColor: colors.primary }]}>
                    <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const userName = profile?.fullName || 'John Doe';
    const userHandle = profile?.username || 'johndoe';
    const avatarUrl = `https://i.pravatar.cc/150?u=${profile?.id || 'default'}`;
    const stats = profile?._count || { posts: 0, comments: 0, likes: 0 };

    // region Main UI
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
                </View>

                <View style={[styles.profileSection, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <Image source={{ uri: avatarUrl }} style={[styles.avatar, { borderColor: colors.surface }]} />
                    <Text style={[styles.name, { color: colors.text }]}>{userName}</Text>
                    <Text style={[styles.username, { color: colors.textSecondary }]}>@{userHandle}</Text>

                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{stats.posts}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{stats.comments}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Comments</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{stats.likes}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Likes</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.menu}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={toggleTheme}
                    >
                        <View style={[styles.menuItemIcon, { backgroundColor: colors.surface }]}>
                            {theme === 'light' ? (
                                <Moon size={20} color={colors.primary} />
                            ) : (
                                <Sun size={20} color={colors.primary} />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.menuItemText, { color: colors.text }]}>Theme Mode</Text>
                            <Text style={{ color: colors.textSecondary, fontSize: 13, textTransform: 'capitalize' }}>{theme} mode</Text>
                        </View>
                        <ChevronRight size={20} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.menuItem, styles.logoutMenuBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={handleLogout}
                    >
                        <View style={[styles.menuItemIcon, { backgroundColor: theme === 'light' ? '#FEE2E2' : '#7f1d1d' }]}>
                            <LogOut size={20} color="#EF4444" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.logoutText}>Log Out</Text>
                            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Sign out of your account</Text>
                        </View>
                        <ChevronRight size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? 30 : 0
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    container: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    iconBtn: {
        padding: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 22,
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#EEF2FF',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    username: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 30,
        paddingHorizontal: 10,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    divider: {
        width: 1,
        backgroundColor: '#F3F4F6',
        height: 30,
        alignSelf: 'center',
    },
    menu: {
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 18,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F9FAFB',
    },
    menuItemIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#F5F7FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    menuDivider: {
        height: 1,
        marginHorizontal: 10,
        marginVertical: 4,
        opacity: 0.5,
    },
    logoutMenuBtn: {
        marginTop: 10,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 40,
    },
    retryBtn: {
        backgroundColor: '#4F46E5',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryBtnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
