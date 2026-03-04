import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, SafeAreaView, Platform, Text } from 'react-native';
import { PostCard } from './components/PostCard';
import { useFeedStore } from '../../store/useFeedStore';
import { Input } from '../../components/Input';
import { Search } from 'lucide-react-native';

export function Home() {
    const { posts, searchQuery, setSearchQuery } = useFeedStore();

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const filteredPosts = useMemo(() => {
        if (!searchQuery) return posts;
        return posts.filter(post =>
            post.author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [posts, searchQuery]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Feeds</Text>
                    <Input
                        placeholder="Search by username..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        leftIcon={<Search size={20} color="#9CA3AF" />}
                        style={styles.searchInput}
                    />
                </View>

                <FlatList
                    data={filteredPosts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <PostCard post={item} />}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyText}>No posts found by that username!</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? 30 : 0
    },
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#111827',
    },
    searchInput: {
        backgroundColor: '#F3F4F6',
        borderWidth: 0,
        minHeight: 44,
    },
    listContent: {
        paddingBottom: 100, // accommodate bottom tab
    },
    emptyBox: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 16,
    }
});
