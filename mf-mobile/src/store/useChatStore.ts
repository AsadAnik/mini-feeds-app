import { create } from 'zustand';
import { api } from '../services/api';

export interface Participant {
    id: string;
    fullName: string;
    username: string;
    avatar?: string;
    avatarConfig?: any;
}

export interface LastMessage {
    id: string;
    content: string;
    senderId: string;
    conversationId: string;
    isRead: boolean;
    createdAt: string;
}

export interface Conversation {
    id: string;
    otherParticipant: Participant;
    lastMessage: LastMessage | null;
    updatedAt: string;
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    conversationId: string;
    isRead: boolean;
    createdAt: string;
}

interface ChatState {
    conversations: Conversation[];
    messages: Record<string, Message[]>; // conversationId -> messages
    isLoadingConversations: boolean;
    isLoadingMessages: boolean;
    isSending: boolean;

    fetchConversations: () => Promise<void>;
    fetchMessages: (conversationId: string) => Promise<void>;
    sendMessage: (receiverId: string, content: string) => Promise<void>;
    startConversation: (friendId: string) => Promise<{ id: string; otherParticipant: Participant }>;
    fetchConversationById: (conversationId: string) => Promise<void>;
    addMessageToConversation: (conversationId: string, message: Message) => void;
    deleteConversation: (conversationId: string) => Promise<void>;
    deleteMessage: (messageId: string, conversationId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    messages: {},
    isLoadingConversations: false,
    isLoadingMessages: false,
    isSending: false,

    fetchConversations: async () => {
        set({ isLoadingConversations: true });
        try {
            const response = await api.get('/chat/conversations');
            set({ conversations: response.data.data });
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            set({ isLoadingConversations: false });
        }
    },

    fetchMessages: async (conversationId: string) => {
        set({ isLoadingMessages: true });
        try {
            const response = await api.get(`/chat/messages/${conversationId}`);
            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: response.data.data
                }
            }));
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            set({ isLoadingMessages: false });
        }
    },

    sendMessage: async (receiverId: string, content: string) => {
        set({ isSending: true });
        try {
            const response = await api.post('/chat/send', { receiverId, content });
            const newMessage = response.data.data as Message;
            const conversationId = newMessage.conversationId;

            // Update messages list for this conversation
            set((state) => {
                const currentMessages = state.messages[conversationId] || [];
                return {
                    messages: {
                        ...state.messages,
                        [conversationId]: [...currentMessages, newMessage]
                    }
                };
            });

            // Update conversation last message in the list
            get().fetchConversations();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        } finally {
            set({ isSending: false });
        }
    },

    startConversation: async (friendId: string) => {
        try {
            const response = await api.post('/chat/start', { friendId });
            const data = response.data.data;
            
            // Sync with local conversations if not present
            const exists = get().conversations.find(c => c.id === data.id);
            if (!exists) {
                await get().fetchConversations();
            }
            
            return data;
        } catch (error) {
            console.error('Error starting conversation:', error);
            throw error;
        }
    },

    fetchConversationById: async (conversationId: string) => {
        try {
            // Since we don't have a single GET /chat/conversations/:id endpoint yet,
            // we can just fetch all and filter, or we rely on the list being up to date.
            // For now, let's just make sure the list is fetched.
            if (get().conversations.length === 0) {
                await get().fetchConversations();
            }
        } catch (error) {
            console.error('Error fetching conversation detail:', error);
        }
    },

    addMessageToConversation: (conversationId: string, message: Message) => {
        set((state) => {
            const currentMessages = state.messages[conversationId] || [];
            // Avoid duplicates
            if (currentMessages.find(m => m.id === message.id)) return state;
            
            return {
                messages: {
                    ...state.messages,
                    [conversationId]: [...currentMessages, message]
                }
            };
        });
    },

    deleteConversation: async (conversationId: string) => {
        try {
            await api.delete(`/chat/conversation/${conversationId}`);
            set((state) => ({
                conversations: state.conversations.filter(c => c.id !== conversationId),
                messages: {
                    ...state.messages,
                    [conversationId]: []
                }
            }));
        } catch (error) {
            console.error('Error deleting conversation:', error);
            throw error;
        }
    },

    deleteMessage: async (messageId: string, conversationId: string) => {
        try {
            await api.delete(`/chat/message/${messageId}`);
            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: (state.messages[conversationId] || []).filter(m => m.id !== messageId)
                }
            }));
            
            // Optionally refresh conversations to update last message preview
            get().fetchConversations();
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }
}));
