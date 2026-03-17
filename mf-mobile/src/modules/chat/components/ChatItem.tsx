import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { MoreVertical, Trash2 } from 'lucide-react-native';
import { ActionSheet } from '@/components/ActionSheet';
import { formatChatTime } from '@/utils/date';

interface ChatItemProps {
    item: any;
    index: number;
    isLast: boolean;
    colors: any;
    onPress: (item: any) => void;
    onDelete: (conversationId: string) => void;
}

import { AvatarRenderer } from '../../profile/components/AvatarRenderer';

// region CHAT ITEM
export function ChatItem({ item, index, isLast, colors, onPress, onDelete }: ChatItemProps) {
    const [menuVisible, setMenuVisible] = useState(false);
    const friend = item.friend;
    const conv = item.conversation;
    const lastMsg = conv?.lastMessage;

    const handleMorePress = () => {
        if (!conv) return;
        setMenuVisible(true);
    };

    const confirmDelete = () => {
        setMenuVisible(false);
        Alert.alert(
            "Delete Conversation",
            "This will permanently delete all messages. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(conv.id) }
            ]
        );
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.chatItem, isLast && { borderBottomWidth: 0 }]}
                activeOpacity={0.7}
                onPress={() => onPress(item)}
            >
                <View style={styles.avatarContainer}>
                    {friend.avatarConfig ? (
                        <AvatarRenderer config={friend.avatarConfig} size={58} />
                    ) : (
                        <Image
                            source={{ uri: friend.avatar || `https://i.pravatar.cc/150?u=${friend.id}` }}
                            style={styles.chatAvatar}
                        />
                    )}
                    <View style={[styles.onlineDotSmall, { borderColor: colors.background }]} />
                </View>

                <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                        <Text style={[styles.chatName, { color: colors.text }]}>{friend.fullName}</Text>
                        <View style={styles.headerRight}>
                            <Text style={[styles.chatTime, { color: colors.textSecondary }]}>
                                {lastMsg ? formatChatTime(lastMsg.createdAt) : ''}
                            </Text>
                            {conv && (
                                <TouchableOpacity onPress={handleMorePress} style={styles.moreButton}>
                                    <MoreVertical size={18} color={colors.textSecondary} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <View style={styles.chatFooter}>
                        <Text
                            style={[
                                styles.chatMessage,
                                {
                                    color: lastMsg ? colors.textSecondary : colors.primary,
                                    fontStyle: lastMsg ? 'normal' : 'italic'
                                }
                            ]}
                            numberOfLines={1}
                        >
                            {lastMsg ? lastMsg.content : 'Tap to start chatting'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <ActionSheet
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                title="Conversation Options"
                options={[
                    {
                        label: "Delete Chat",
                        icon: Trash2,
                        variant: 'danger',
                        onPress: confirmDelete
                    }
                ]}
            />
        </>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
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
        width: 58,
        height: 58,
        borderRadius: 29,
    },
    onlineDotSmall: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moreButton: {
        padding: 4,
        marginLeft: 4,
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
});
