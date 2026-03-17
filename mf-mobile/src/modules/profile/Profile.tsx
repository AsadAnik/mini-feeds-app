import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
    LogOut,
    Moon,
    Sun,
    ChevronRight,
    Settings, 
    Edit2,
    Palette
} from 'lucide-react-native';
import { useProfile } from './hooks/useProfile';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { AvatarRenderer } from './components/AvatarRenderer';

const { width } = Dimensions.get('window');

// region COMPONENTS
const StatItem = ({ label, value, colors }: { label: string; value: number; colors: any }) => (
    <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
);

interface MenuItemProps {
    label: string;
    icon: any;
    color: string;
    value?: string;
    onPress: () => void;
    colors: any;
    theme: string;
    isDestructive?: boolean;
}

const MenuItem = ({ label, icon: Icon, color, value, onPress, colors, theme, isDestructive }: MenuItemProps) => (
    <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.menuItem, theme === 'dark' ? styles.cardDark : styles.cardLight]}
        onPress={onPress}
    >
        <View style={[styles.menuIconWrapper, { backgroundColor: `${color}15` }]}>
            <Icon size={20} color={color} />
        </View>
        <Text style={[styles.menuText, { color: isDestructive ? '#EF4444' : colors.text }]}>{label}</Text>
        <View style={styles.menuRight}>
            {value && <Text style={[styles.menuValue, { color: colors.textSecondary }]}>{value}</Text>}
            <ChevronRight size={18} color={colors.textSecondary} />
        </View>
    </TouchableOpacity>
);

// region PROFILE
export function Profile() {
    const { profile, isLoading, error, fetchProfile, handleLogout } = useProfile();
    const { theme, toggleTheme } = useThemeStore();
    const [refreshing, setRefreshing] = React.useState(false);
    const colors = Colors[theme];
    const router = useRouter();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (profile) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }
    }, [profile, fadeAnim]);

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

    const userName = profile?.fullName || 'User';
    const userHandle = profile?.username || 'username';
    const avatarUrl = `https://i.pravatar.cc/150?u=${profile?.id || 'default'}`;
    const stats = profile?._count || { posts: 0, comments: 0, likes: 0 };

    const bgColors = theme === 'dark'
        ? (['#020617', '#0f172a'] as const)
        : (['#f8fafc', '#ffffff'] as const);

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const menuSections = [
        {
            title: 'PREFERENCES',
            items: [
                {
                    label: 'Custom Avatar',
                    icon: Palette,
                    color: '#8B5CF6',
                    onPress: () => router.push('/profile/avatar')
                },
                {
                    label: 'Dark Mode',
                    icon: theme === 'light' ? Moon : Sun,
                    color: colors.primary,
                    value: theme === 'dark' ? 'On' : 'Off',
                    onPress: toggleTheme
                }
            ]
        },
        {
            title: 'ACCOUNT',
            items: [
                {
                    label: 'Log Out',
                    icon: LogOut,
                    color: '#EF4444',
                    onPress: handleLogout,
                    isDestructive: true
                }
            ]
        }
    ];

    // region Main UI
    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={bgColors} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={styles.safeArea}>
                <Animated.View style={[styles.mainHeader, { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity }]}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity 
                            style={[styles.headerIconBtn, { backgroundColor: colors.surface }]}
                            onPress={() => router.push('/profile/edit')}
                        >
                            <Edit2 size={20} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.headerIconBtn, { backgroundColor: colors.surface }]}
                            onPress={() => router.push('/profile/settings')}
                        >
                            <Settings size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <Animated.ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                        />
                    }
                >
                    <Animated.View style={[styles.profileSection, { opacity: fadeAnim }]}>
                        <View style={styles.avatarContainer}>
                            <View style={[styles.avatarOuterRing, { borderColor: colors.primary + '20' }]}>
                                {profile?.avatarConfig ? (
                                    <AvatarRenderer config={profile.avatarConfig} size={130} />
                                ) : (
                                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                                )}
                            </View>
                            <TouchableOpacity 
                                style={[styles.editAvatarBadge, { backgroundColor: colors.primary }]}
                                onPress={() => router.push('/profile/avatar')}
                            >
                                <Palette size={14} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.name, { color: colors.text }]}>{userName}</Text>
                        <Text style={[styles.username, { color: colors.textSecondary }]}>@{userHandle}</Text>

                        <View style={[styles.statsCard, theme === 'dark' ? styles.cardDark : styles.cardLight]}>
                            <StatItem label="Posts" value={stats.posts} colors={colors} />
                            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                            <StatItem label="Comments" value={stats.comments} colors={colors} />
                            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                            <StatItem label="Likes" value={stats.likes} colors={colors} />
                        </View>
                    </Animated.View>

                    <View style={styles.menuContainer}>
                        {menuSections.map((section, sIndex) => (
                            <React.Fragment key={section.title}>
                                <Text style={[styles.menuSectionTitle, { color: colors.textSecondary, marginTop: sIndex > 0 ? 24 : 0 }]}>
                                    {section.title}
                                </Text>
                                {section.items.map((item) => (
                                    <MenuItem
                                        key={item.label}
                                        {...item}
                                        colors={colors}
                                        theme={theme}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </View>
                </Animated.ScrollView>
            </SafeAreaView>
        </View>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { paddingBottom: 120 },
    mainHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 10,
        paddingTop: 8,
        zIndex: 10,
    },
    headerTitle: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    headerActions: { flexDirection: 'row', gap: 12 },
    headerIconBtn: { width: 44, height: 44, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    profileSection: { alignItems: 'center', paddingVertical: 10 },
    avatarContainer: { position: 'relative', marginBottom: 20 },
    avatarOuterRing: {
        padding: 5,
        borderRadius: 100,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    avatar: { width: 130, height: 130, borderRadius: 65, borderWidth: 4, borderColor: '#FFFFFF' },
    editAvatarBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    name: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
    username: { fontSize: 16, fontWeight: '600', marginTop: 4, opacity: 0.6 },
    statsCard: {
        flexDirection: 'row',
        width: '90%',
        marginTop: 30,
        borderRadius: 28,
        paddingVertical: 24,
        justifyContent: 'space-around',
    },
    cardLight: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    cardDark: { 
        backgroundColor: 'rgba(30, 41, 59, 0.4)', 
        borderWidth: 1, 
        borderColor: 'rgba(255, 255, 255, 0.05)' 
    },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 22, fontWeight: '900' },
    statLabel: { fontSize: 13, fontWeight: '700', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    statDivider: { width: 1, height: 40, opacity: 0.2 },
    menuContainer: { paddingHorizontal: 24, marginTop: 25 },
    menuSectionTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 15, marginLeft: 5 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
    },
    menuIconWrapper: { width: 48, height: 48, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 18 },
    menuText: { flex: 1, fontSize: 16, fontWeight: '700' },
    menuRight: { flexDirection: 'row', alignItems: 'center' },
    menuValue: { fontSize: 14, fontWeight: '700', marginRight: 10, opacity: 0.5 },
    errorText: { fontSize: 16, textAlign: 'center', marginBottom: 20, paddingHorizontal: 40 },
    retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
    retryBtnText: { color: '#FFFFFF', fontWeight: '800' }
});
