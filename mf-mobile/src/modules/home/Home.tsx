import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    SafeAreaView,
    Platform,
    Text,
    ActivityIndicator,
} from 'react-native';
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

    // region Main UI
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.surface }]}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Feeds</Text>
                    <Input
                        placeholder="Search by username..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        leftIcon={<Search size={18} color={colors.textSecondary} />}
                        containerStyle={styles.searchInputContainer}
                        style={{ color: colors.text, backgroundColor: colors.inputBackground }}
                    />
                </View>

                {isLoadingPosts && filteredPosts.length === 0 ? (
                    <View style={{ backgroundColor: colors.surface }}>
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
                                </View>
                            ) : null
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? 30 : 0 },
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#111827' },
    searchInputContainer: { marginBottom: 0 },
    loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { color: '#9CA3AF', fontSize: 15 },
    listContent: { paddingBottom: 100 },
    emptyBox: { paddingTop: 80, alignItems: 'center', gap: 10 },
    emptyIcon: { fontSize: 40 },
    emptyText: { color: '#9CA3AF', fontSize: 16 },
    footerLoader: { paddingVertical: 20, alignItems: 'center' },
});
