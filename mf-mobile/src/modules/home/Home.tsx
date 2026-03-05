import React, { useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    SafeAreaView,
    Platform,
    Text,
    StatusBar,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PostCard } from './components/PostCard';
import { Input } from '../../components/Input';
import { Search } from 'lucide-react-native';
import { useHome } from './hooks/useHome';
import { PostSkeleton } from './components/PostSkeleton';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';

// region HOME
export function Home() {
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const {
        filteredPosts,
        searchQuery,
        setSearchQuery,
        isLoadingPosts,
        isFetchingMore,
        refreshing,
        onRefresh,
        handleEndReached,
    } = useHome();

    const fadeAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.7,
                    duration: 5000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 5000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    const bgColors1 = theme === 'dark'
        ? (['#000000', '#0f172a', '#000000'] as const)
        : (['#f8fafc', '#ffffff', '#f8fafc'] as const);

    const bgColors2 = theme === 'dark'
        ? (['#0f172a', '#1e293b', '#000000'] as const)
        : (['#ffffff', '#f1f5f9', '#ffffff'] as const);

    // region Main UI
    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Soft Animated Background */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient colors={bgColors1} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                    <LinearGradient colors={bgColors2} style={StyleSheet.absoluteFill} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} />
                </Animated.View>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Premium Header */}
                    <View style={[
                        styles.header,
                        theme === 'dark' ? styles.headerDark : styles.headerLight
                    ]}>
                        <View style={styles.headerTop}>
                            <Text style={[styles.headerTitle, { color: colors.text }]}>Feeds</Text>
                            <View style={[styles.titleBadge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.badgeText}>{filteredPosts.length}</Text>
                            </View>
                        </View>

                        <Input
                            placeholder="Search by username..."
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            leftIcon={<Search size={18} color={colors.textSecondary} />}
                            containerStyle={styles.searchInputContainer}
                            style={[
                                styles.searchInput,
                                {
                                    color: colors.text,
                                }
                            ]}
                        />
                    </View>

                    {isLoadingPosts && filteredPosts.length === 0 ? (
                        <View style={{ flex: 1 }}>
                            {[1, 2, 3, 4, 5].map((key) => (
                                <PostSkeleton key={key} />
                            ))}
                        </View>
                    ) : (
                        <FlatList
                            data={filteredPosts}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <PostCard post={item} />}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    tintColor={colors.primary}
                                    colors={[colors.primary]}
                                />
                            }
                            onEndReached={handleEndReached}
                            onEndReachedThreshold={0.4}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyBox}>
                                    <Text style={styles.emptyIcon}>📭</Text>
                                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                        {searchQuery ? 'No users found matching that search.' : 'No posts yet.'}
                                    </Text>
                                </View>
                            }
                            ListFooterComponent={
                                isFetchingMore ? (
                                    <View style={styles.footerLoader}>
                                        <PostSkeleton />
                                        <PostSkeleton />
                                    </View>
                                ) : null
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
    safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    container: { flex: 1 },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
    },
    headerLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    },
    headerDark: {
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    titleBadge: {
        marginLeft: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    searchInputContainer: {
        marginBottom: 0,
        shadowOpacity: 0,
        elevation: 0,
    },
    searchInput: {
        borderRadius: 14,
        height: 48,
        fontSize: 15,
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 100,
        paddingHorizontal: 16,
    },
    emptyBox: {
        paddingTop: 80,
        alignItems: 'center',
        gap: 12
    },
    emptyIcon: {
        fontSize: 48,
        opacity: 0.6,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    footerLoader: {
        paddingVertical: 24,
    },
});
