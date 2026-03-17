import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Platform,
    StatusBar,
    Image,
    KeyboardAvoidingView,
    RefreshControl
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatRoom } from './hooks/useChatRoom';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';

import { AvatarRenderer } from '../profile/components/AvatarRenderer';

// region CHAT ROOM
export function ChatRoom() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    const conversationId = id as string;
    const {
        chatMessages,
        otherParticipant,
        user,
        inputText,
        setInputText,
        isSending,
        isLoadingMessages,
        isKeyboardVisible,
        listRef,
        sendMessage,
        handleRefresh,
        deleteMessage,
        isSocketConnected
    } = useChatRoom(conversationId);

    const bgColors1 = theme === 'dark'
        ? (['#000000', '#0f172a', '#000000'] as const)
        : (['#f8fafc', '#ffffff', '#e2e8f0'] as const);

    // region Main UI
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

            <View style={StyleSheet.absoluteFill}>
                <LinearGradient colors={bgColors1} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.container}>
                    {/* Header */}
                    <View style={[
                        styles.header,
                        {
                            paddingTop: insets.top + 10,
                            borderBottomColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                        }
                    ]}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <ChevronLeft size={28} color={colors.text} />
                            </TouchableOpacity>
                            <View style={styles.userInfo}>
                                <View>
                                    {otherParticipant?.avatarConfig ? (
                                        <View style={{ marginRight: 12 }}>
                                            <AvatarRenderer config={otherParticipant.avatarConfig} size={42} />
                                        </View>
                                    ) : (
                                        <Image source={{ uri: otherParticipant?.avatar || `https://i.pravatar.cc/150?u=${otherParticipant?.id || '1'}` }} style={styles.headerAvatar} />
                                    )}
                                    <View style={[styles.onlineDot, { borderColor: theme === 'dark' ? '#0f172a' : '#fff' }]} />
                                </View>
                                <View>
                                    <Text style={[styles.headerName, { color: colors.text }]}>{otherParticipant?.fullName || 'Chat'}</Text>
                                    <View style={styles.statusRow}>
                                        <Text style={[styles.headerStatus, { color: isSocketConnected ? '#22c55e' : colors.textSecondary }]}>
                                            {isSocketConnected ? 'Connected' : 'Connecting...'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            {/* Actions removed */}
                        </View>
                    </View>

                    {/* Chat Area */}
                    <FlatList
                        ref={listRef}
                        data={chatMessages}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <MessageBubble
                                item={item}
                                isMe={item.senderId === user?.id}
                                otherParticipant={otherParticipant}
                                colors={colors}
                                theme={theme}
                                onDelete={deleteMessage}
                            />
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoadingMessages}
                                onRefresh={handleRefresh}
                                tintColor={colors.primary}
                                colors={[colors.primary]}
                            />
                        }
                        contentContainerStyle={[styles.chatListContent, { paddingBottom: 20 }]}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
                    />

                    {/* Input Area */}
                    <ChatInput
                        inputText={inputText}
                        setInputText={setInputText}
                        onSend={sendMessage}
                        isSending={isSending}
                        colors={colors}
                        theme={theme}
                        insets={insets}
                        isKeyboardVisible={isKeyboardVisible}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingBottom: 15,
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
        bottom: 2,
        right: 12,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#22c55e',
        borderWidth: 2,
    },
    headerName: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 2,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerStatus: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
    },
});
