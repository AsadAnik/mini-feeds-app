import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Message } from '@/store/useChatStore';
import { Trash2 } from 'lucide-react-native';
import { ActionSheet } from '@/components/ActionSheet';

interface MessageBubbleProps {
    item: Message;
    isMe: boolean;
    otherParticipant: any;
    colors: any;
    theme: string;
    onDelete?: (messageId: string) => void;
}

import { AvatarRenderer } from '../../profile/components/AvatarRenderer';

// region MESSAGE BUBBLE
export function MessageBubble({ item, isMe, otherParticipant, colors, theme, onDelete }: MessageBubbleProps) {
    const [menuVisible, setMenuVisible] = useState(false);
    const time = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleLongPress = () => {
        if (!isMe || !onDelete) return;
        setMenuVisible(true);
    };

    const confirmDelete = () => {
        setMenuVisible(false);
        Alert.alert(
            "Unsend Message",
            "Stop sending this message? This will remove it for everyone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Unsend", style: "destructive", onPress: () => onDelete?.(item.id) }
            ]
        );
    };

    return (
        <>
            <View style={[styles.messageWrapper, isMe ? styles.messageWrapperRight : styles.messageWrapperLeft]}>
                {!isMe && (
                    otherParticipant?.avatarConfig ? (
                        <View style={{ marginRight: 8 }}>
                            <AvatarRenderer config={otherParticipant.avatarConfig} size={28} />
                        </View>
                    ) : (
                        <Image source={{ uri: otherParticipant?.avatar || `https://i.pravatar.cc/150?u=${otherParticipant?.id || '1'}` }} style={styles.messageAvatar} />
                    )
                )}
                <TouchableOpacity 
                    activeOpacity={0.8}
                    onLongPress={handleLongPress}
                    style={[
                        styles.messageBubble,
                        isMe ? [styles.messageBubbleRight, { backgroundColor: colors.primary }] : [styles.messageBubbleLeft, { backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9' }]
                    ]}
                >
                    <Text style={[styles.messageText, { color: isMe ? '#ffffff' : colors.text }]}>{item.content}</Text>
                    <Text style={[styles.messageTime, { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}>{time}</Text>
                </TouchableOpacity>
            </View>

            <ActionSheet
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                title="Message Options"
                options={[
                    {
                        label: "Unsend Message",
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
    messageWrapper: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    messageWrapperLeft: {
        justifyContent: 'flex-start',
    },
    messageWrapperRight: {
        justifyContent: 'flex-end',
    },
    messageAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    messageBubbleLeft: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 4,
    },
    messageBubbleRight: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    messageTime: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 4,
        fontWeight: '500',
    },
});
