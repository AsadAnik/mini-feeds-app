import React, { useRef, useEffect } from 'react';
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
    StatusBar,
    Animated,
} from 'react-native';
import { LogOut, Moon, Sun, ChevronRight, Settings, Shield, User as UserIcon } from 'lucide-react-native';
import { useProfile } from './hooks/useProfile';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

// region PROFILE
export function Profile() {
    const { profile, isLoading, error, fetchProfile, handleLogout } = useProfile();
    const { theme, toggleTheme } = useThemeStore();
    const [refreshing, setRefreshing] = React.useState(false);
    const colors = Colors[theme];

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, [profile]);

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

    const bgColors = theme === 'dark'
        ? (['#000000', '#0f172a'] as const)
        : (['#f8fafc', '#ffffff'] as const);

    // region Main UI
    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={bgColors} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                        />
                    }
                >
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                            <Settings size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <Animated.View style={[styles.profileSection, { opacity: fadeAnim }]}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                            <View style={[styles.onlineIndicator, { borderColor: colors.background }]} />
                        </View>

                        <Text style={[styles.name, { color: colors.text }]}>{userName}</Text>
                        <Text style={[styles.username, { color: colors.textSecondary }]}>@{userHandle}</Text>

                        <View style={[styles.statsCard, theme === 'dark' ? styles.cardDark : styles.cardLight]}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: colors.text }]}>{stats.posts}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
                            </View>
                            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: colors.text }]}>{stats.comments}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Comments</Text>
                            </View>
                            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: colors.text }]}>{stats.likes}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Likes</Text>
                            </View>
                        </View>
                    </Animated.View>

                    <View style={styles.menuContainer}>
                        <Text style={[styles.menuSectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.menuItem, theme === 'dark' ? styles.cardDark : styles.cardLight]}
                            onPress={toggleTheme}
                        >
                            <View style={[styles.menuIconWrapper, { backgroundColor: colors.primary + '10' }]}>
                                {theme === 'light' ? (
                                    <Moon size={20} color={colors.primary} />
                                ) : (
                                    <Sun size={20} color={colors.primary} />
                                )}
                            </View>
                            <Text style={[styles.menuText, { color: colors.text }]}>Dark Mode</Text>
                            <Text style={[styles.menuValue, { color: colors.textSecondary }]}>{theme === 'dark' ? 'On' : 'Off'}</Text>
                            <ChevronRight size={18} color={colors.textSecondary} />
                        </TouchableOpacity>

                        {/* 
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.menuItem, theme === 'dark' ? styles.cardDark : styles.cardLight]}
                        >
                            <View style={[styles.menuIconWrapper, { backgroundColor: '#10B98110' }]}>
                                <Shield size={20} color="#10B981" />
                            </View>
                            <Text style={[styles.menuText, { color: colors.text }]}>Privacy & Safety</Text>
                            <ChevronRight size={18} color={colors.textSecondary} />
                        </TouchableOpacity> */}

                        <Text style={[styles.menuSectionTitle, { color: colors.textSecondary, marginTop: 24 }]}>ACCOUNT</Text>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.menuItem, theme === 'dark' ? styles.cardDark : styles.cardLight]}
                            onPress={handleLogout}
                        >
                            <View style={[styles.menuIconWrapper, { backgroundColor: '#EF444410' }]}>
                                <LogOut size={20} color="#EF4444" />
                            </View>
                            <Text style={[styles.menuText, { color: '#EF4444' }]}>Log Out</Text>
                            <ChevronRight size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { paddingBottom: 120 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 20,
    },
    headerTitle: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
    iconBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    profileSection: { alignItems: 'center', paddingVertical: 20 },
    avatarContainer: { position: 'relative', marginBottom: 20 },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FFFFFF' },
    onlineIndicator: { position: 'absolute', bottom: 5, right: 10, width: 22, height: 22, borderRadius: 11, backgroundColor: '#10B981', borderWidth: 4 },
    name: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
    username: { fontSize: 16, fontWeight: '500', marginTop: 4 },
    statsCard: {
        flexDirection: 'row',
        width: '90%',
        marginTop: 32,
        borderRadius: 24,
        paddingVertical: 20,
        justifyContent: 'space-around',
    },
    cardLight: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 20,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    cardDark: { backgroundColor: 'rgba(30, 41, 59, 0.5)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 20, fontWeight: '900' },
    statLabel: { fontSize: 13, fontWeight: '600', marginTop: 4 },
    statDivider: { width: 1, height: 30, opacity: 0.5 },
    menuContainer: { paddingHorizontal: 24, marginTop: 10 },
    menuSectionTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
    },
    menuIconWrapper: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    menuText: { flex: 1, fontSize: 16, fontWeight: '700' },
    menuValue: { fontSize: 14, fontWeight: '600', marginRight: 10 },
    errorText: { fontSize: 16, textAlign: 'center', marginBottom: 20, paddingHorizontal: 40 },
    retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
    retryBtnText: { color: '#FFFFFF', fontWeight: '800' }
});
