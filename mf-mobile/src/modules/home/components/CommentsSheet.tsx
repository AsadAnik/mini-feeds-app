import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { X, Send, Trash2 } from 'lucide-react-native';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { Comment } from '../../../store/useFeedStore';
import { timeAgo } from '@/utils/date';

interface CommentsSheetProps {
    visible: boolean;
    postId: string;
    onClose: () => void;
}


const LIMIT = 5;

import { AvatarRenderer } from '../../profile/components/AvatarRenderer';

// region COMMENTS SHEET
export function CommentsSheet({ visible, postId, onClose }: CommentsSheetProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const user = useAuthStore((state) => state.user);
    const { theme } = useThemeStore();
    const colors = Colors[theme];

    const fetchComments = useCallback(async (pageNum: number, replace: boolean) => {
        if (replace) setIsLoading(true);
        else setIsLoadingMore(true);

        try {
            const res = await api.get(`/posts/${postId}/comments?page=${pageNum}&limit=${LIMIT}`);
            if (res.data?.success) {
                const fetched: Comment[] = res.data.data;
                setComments((prev) => replace ? fetched : [...prev, ...fetched]);
                setTotalPages(res.data.pagination?.totalPages ?? 0);
                setPage(pageNum);
            }
        } catch (e) {
            console.error('Failed to load comments', e);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [postId]);

    useEffect(() => {
        if (visible) {
            setComments([]);
            setPage(1);
            fetchComments(1, true);
        }
    }, [visible, fetchComments]);

    const handleLoadMore = () => {
        if (page < totalPages && !isLoadingMore) {
            fetchComments(page + 1, false);
        }
    };

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await api.post(`/posts/${postId}/comment`, { content: newComment.trim() });
            if (res.data?.success) {
                setComments((prev) => [res.data.data, ...prev]);
                setNewComment('');
            }
        } catch (e) {
            Alert.alert('Error', 'Could not post comment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string, authorId: string) => {
        if (user?.id !== authorId) return;

        Alert.alert('Delete Comment', 'Remove this comment?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/posts/comments/${commentId}`);
                        setComments((prev) => prev.filter((c) => c.id !== commentId));
                    } catch {
                        Alert.alert('Error', 'Failed to delete comment.');
                    }
                },
            },
        ]);
    };

    const renderComment = ({ item }: { item: Comment }) => {
        const isOwner = user?.id === item.authorId;
        const authorLabel = item.author?.fullName || item.author?.email?.split('@')[0] || 'user';
        const avatarUri = `https://i.pravatar.cc/80?u=${item.authorId}`;
        return (
            <View style={styles.commentRow}>
                {item.author?.avatarConfig ? (
                    <View style={{ marginRight: 10 }}>
                        <AvatarRenderer config={item.author.avatarConfig} size={36} />
                    </View>
                ) : (
                    <Image source={{ uri: avatarUri }} style={[styles.commentAvatar, { borderColor: colors.surface }]} />
                )}
                <View style={[styles.commentBubble, { backgroundColor: colors.surface }]}>
                    <View style={styles.commentHeader}>
                        <Text style={[styles.commentAuthor, { color: colors.text }]}>{authorLabel}</Text>
                        <Text style={[styles.commentTime, { color: colors.textSecondary }]}>{timeAgo(item.createdAt)}</Text>
                    </View>
                    <Text style={[styles.commentContent, { color: colors.textSecondary }]}>{item.content}</Text>
                </View>
                {isOwner && (
                    <TouchableOpacity
                        onPress={() => handleDeleteComment(item.id, item.authorId)}
                        style={styles.deleteBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Trash2 size={16} color={colors.danger} />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // region Main UI
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                style={styles.overlay}
            >
                <TouchableOpacity style={styles.backdropPress} activeOpacity={1} onPress={onClose} />
                <View
                    style={[styles.sheet, { backgroundColor: colors.card }]}
                >
                    {/* Handle bar */}
                    <View style={[styles.handle, { backgroundColor: colors.surface }]} />

                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Comments</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={22} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Comment list */}
                    {isLoading ? (
                        <View style={styles.loadingBox}>
                            <ActivityIndicator color={colors.primary} size="large" />
                        </View>
                    ) : (
                        <FlatList
                            data={comments}
                            keyExtractor={(item) => item.id}
                            renderItem={renderComment}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyBox}>
                                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No comments yet. Be the first!</Text>
                                </View>
                            }
                            ListFooterComponent={
                                page < totalPages ? (
                                    <TouchableOpacity
                                        style={styles.loadMoreBtn}
                                        onPress={handleLoadMore}
                                        disabled={isLoadingMore}
                                    >
                                        {isLoadingMore
                                            ? <ActivityIndicator color={colors.primary} size="small" />
                                            : <Text style={[styles.loadMoreText, { color: colors.primary }]}>Load more comments</Text>
                                        }
                                    </TouchableOpacity>
                                ) : null
                            }
                        />
                    )}

                    {/* Input bar */}
                    <View style={[styles.inputBar, { borderTopColor: colors.border, paddingBottom: 30 }]}>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                            placeholder="Write a comment..."
                            placeholderTextColor={colors.textSecondary}
                            value={newComment}
                            onChangeText={setNewComment}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, { backgroundColor: colors.primary }, !newComment.trim() && { opacity: 0.5 }]}
                            onPress={handleSubmit}
                            disabled={!newComment.trim() || isSubmitting}
                        >
                            {isSubmitting
                                ? <ActivityIndicator color="#fff" size="small" />
                                : <Send size={18} color="#fff" />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    backdropPress: {
        flex: 1,
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        minHeight: 400,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },
    closeBtn: {
        padding: 4,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    loadingBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyBox: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 15,
    },
    commentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
        backgroundColor: '#E5E7EB',
    },
    commentBubble: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 10,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    commentAuthor: {
        fontWeight: '600',
        fontSize: 13,
        color: '#374151',
    },
    commentTime: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    commentContent: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    deleteBtn: {
        marginTop: 8,
        marginLeft: 8,
    },
    loadMoreBtn: {
        alignItems: 'center',
        paddingVertical: 14,
        marginBottom: 4,
    },
    loadMoreText: {
        color: '#4F46E5',
        fontWeight: '600',
        fontSize: 14,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 10,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: '#111827',
    },
    sendBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#4F46E5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: '#C4B5FD',
    },
});
