import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
    Animated,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Info, Send, Phone, Video, Paperclip, Smile } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INITIAL_MESSAGES = [
    { id: '1', text: 'Hey there! How have you been?', isMe: false, time: '10:30 AM' },
    { id: '2', text: 'Im good, just working on a new app design. It looks awesome!', isMe: true, time: '10:32 AM' },
    { id: '3', text: 'That sounds great! Can you show me some screens?', isMe: false, time: '10:33 AM' },
    { id: '4', text: 'Sure, let me finish the chat UI and I will send over some screenshots.', isMe: true, time: '10:45 AM' },
    { id: '5', text: 'Awesome! Looking forward to it.', isMe: false, time: '10:46 AM' },
];

// region CHAT ROOM
export function ChatRoom() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const listRef = useRef<FlatList>(null);

    const bgColors1 = theme === 'dark'
        ? (['#000000', '#0f172a', '#000000'] as const)
        : (['#f8fafc', '#ffffff', '#e2e8f0'] as const);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: inputText.trim(),
            isMe: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderMessage = ({ item }: { item: typeof INITIAL_MESSAGES[0] }) => {
        const isMe = item.isMe;
        return (
            <View style={[styles.messageWrapper, isMe ? styles.messageWrapperRight : styles.messageWrapperLeft]}>
                {!isMe && (
                    <Image source={{ uri: `https://i.pravatar.cc/150?u=${id || '1'}` }} style={styles.messageAvatar} />
                )}
                <View style={[
                    styles.messageBubble,
                    isMe ? [styles.messageBubbleRight, { backgroundColor: colors.primary }] : [styles.messageBubbleLeft, { backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9' }]
                ]}>
                    <Text style={[styles.messageText, { color: isMe ? '#ffffff' : colors.text }]}>{item.text}</Text>
                    <Text style={[styles.messageTime, { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}>{item.time}</Text>
                </View>
            </View>
        );
    };

    // region Main UI
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Soft Background */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient colors={bgColors1} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            </View>

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <ChevronLeft size={28} color={colors.text} />
                            </TouchableOpacity>
                            <View style={styles.userInfo}>
                                <Image source={{ uri: `https://i.pravatar.cc/150?u=${id || '1'}` }} style={styles.headerAvatar} />
                                <View style={styles.onlineDot} />
                                <View>
                                    <Text style={[styles.headerName, { color: colors.text }]}>Sarah Parker</Text>
                                    <Text style={[styles.headerStatus, { color: colors.primary }]}>Active Now</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.headerAction}>
                                <Phone size={20} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerAction}>
                                <Video size={22} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Chat Area */}
                    <FlatList
                        ref={listRef}
                        data={messages}
                        keyExtractor={item => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={styles.chatListContent}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
                    />

                    {/* Input Area */}
                    <View style={[
                        styles.inputContainer,
                        {
                            backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.9)',
                            borderTopColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                        }
                    ]}>
                        <TouchableOpacity style={styles.attachButton}>
                            <Paperclip size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                        <View style={[styles.textInputWrapper, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                            <TextInput
                                style={[styles.textInput, { color: colors.text }]}
                                placeholder="Type a message..."
                                placeholderTextColor={colors.textSecondary}
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                                maxLength={500}
                                onSubmitEditing={handleSend}
                            />
                            <TouchableOpacity style={styles.smileButton}>
                                <Smile size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        {inputText.trim().length > 0 ? (
                            <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={handleSend}>
                                <Send size={18} color="#FFFFFF" strokeWidth={2.5} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.sendButton, { backgroundColor: 'transparent' }]}>
                                <Send size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingBottom: 15,
        paddingTop: 10,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 10,
        marginLeft: -5,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 12,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        left: 30,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#22c55e',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    headerName: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 2,
    },
    headerStatus: {
        fontSize: 12,
        fontWeight: '600',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAction: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
    chatListContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 20,
    },
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
    },
    attachButton: {
        padding: 5,
        marginRight: 5,
    },
    textInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        paddingHorizontal: 5,
        paddingLeft: 15,
        minHeight: 46,
        maxHeight: 100,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        maxHeight: 100,
        paddingTop: 12,
        paddingBottom: 12,
    },
    smileButton: {
        padding: 10,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
});
