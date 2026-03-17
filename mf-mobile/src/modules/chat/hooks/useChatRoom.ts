import { useState, useRef, useEffect } from 'react';
import { FlatList, Keyboard, Platform } from 'react-native';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import SocketService from '@/services/socket.service';
import { playChatSound } from '@/utils/sounds';

export function useChatRoom(conversationId: string) {
    const { 
        messages, 
        fetchMessages, 
        sendMessage: storeSendMessage, 
        isSending, 
        conversations, 
        fetchConversationById,
        isLoadingMessages,
        deleteMessage: storeDeleteMessage
    } = useChatStore();
    const { user } = useAuthStore();
    const [inputText, setInputText] = useState('');
    const listRef = useRef<FlatList>(null);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    const chatMessages = messages[conversationId] || [];
    const conversation = conversations.find(c => c.id === conversationId);
    const otherParticipant = conversation?.otherParticipant;

    useEffect(() => {
        if (conversationId && user) {
            fetchConversationById(conversationId);
            fetchMessages(conversationId);
            
            // Socket lifecycle
            SocketService.connect(user.id);
            SocketService.joinRoom(conversationId);
            setIsSocketConnected(true); // Simplified for now
        }
        
        return () => {
            if (conversationId) {
                SocketService.leaveRoom(conversationId);
            }
        };
    }, [conversationId, user]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const sendMessage = async () => {
        if (!inputText.trim() || !otherParticipant || isSending) return;

        const content = inputText.trim();
        setInputText('');
        
        try {
            await storeSendMessage(otherParticipant.id, content);
            playChatSound('messageSent');
            setTimeout(() => {
                listRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleRefresh = () => {
        if (conversationId) {
            fetchMessages(conversationId);
        }
    };

    return {
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
        deleteMessage: (messageId: string) => storeDeleteMessage(messageId, conversationId),
        isSocketConnected
    };
}
