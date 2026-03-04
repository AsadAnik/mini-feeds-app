import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react-native';
import { Post, useFeedStore } from '../../../store/useFeedStore';

interface PostCardProps {
    post: Post;
    onCommentPress?: () => void;
}

export function PostCard({ post, onCommentPress }: PostCardProps) {
    const toggleLike = useFeedStore((state) => state.toggleLike);

    // Formatting date logic mocked
    const timeAgo = 'Just now'; // Should be calculated using dayjs/date-fns 

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
                <View style={styles.authorInfo}>
                    <Text style={styles.fullName}>{post.author.fullName}</Text>
                    <Text style={styles.username}>@{post.author.username} • {timeAgo}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <MoreHorizontal color="#6B7280" size={20} />
                </TouchableOpacity>
            </View>

            <Text style={styles.content}>{post.content}</Text>

            <View style={styles.actionsBox}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                    onPress={() => toggleLike(post.id)}
                >
                    <Heart
                        size={22}
                        color={post.isLikedByMe ? "#EF4444" : "#6B7280"}
                        fill={post.isLikedByMe ? "#EF4444" : "transparent"}
                    />
                    <Text style={[styles.actionText, post.isLikedByMe && styles.actionLikedText]}>
                        {post.likes}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                    onPress={onCommentPress}
                >
                    <MessageCircle size={22} color="#6B7280" />
                    <Text style={styles.actionText}>{post.commentsOriginal}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                    <Share2 size={22} color="#6B7280" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    authorInfo: {
        flex: 1,
    },
    fullName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#111827',
    },
    username: {
        color: '#6B7280',
        fontSize: 14,
        marginTop: 2,
    },
    moreButton: {
        padding: 4,
    },
    content: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 22,
        marginBottom: 16,
    },
    actionsBox: {
        flexDirection: 'row',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        marginLeft: 6,
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    },
    actionLikedText: {
        color: '#EF4444',
    }
});
