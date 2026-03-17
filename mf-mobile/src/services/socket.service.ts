import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../store/useChatStore';
import { playChatSound } from '../utils/sounds';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

class SocketService {
    private socket: Socket | null = null;
    private currentRoom: string | null = null;

    /**
     * CONNECT TO SOCKET SERVER
     * @param userId 
     * @returns 
     */
    public connect = (userId: string) => {
        if (this.socket?.connected) return;

        this.socket = io(SOCKET_URL, {
            query: { userId },
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('Mobile connected to socket server');
        });

        this.socket.on('new_message', (message) => {
            console.log('Received new message via socket:', message);

            // Add to store
            const { addMessageToConversation, fetchConversations } = useChatStore.getState();
            addMessageToConversation(message.conversationId, message);

            // Update conversation list for last message
            fetchConversations();

            // Play sound if not the sender
            if (message.senderId !== userId) {
                playChatSound('messageReceived');
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Mobile disconnected from socket server');
        });
    };

    /**
     * JOIN CHAT ROOM
     * @param conversationId 
     * @returns 
     */
    public joinRoom = (conversationId: string) => {
        if (!this.socket) return;
        this.socket.emit('join_room', conversationId);
        this.currentRoom = conversationId;
    };

    /**
     * LEAVE CHAT ROOM
     * @param conversationId 
     * @returns 
     */
    public leaveRoom = (conversationId: string) => {
        if (!this.socket) return;
        this.socket.emit('leave_room', conversationId);
        this.currentRoom = null;
    };

    /**
     * DISCONNECT FROM SOCKET SERVER
     */
    public disconnect = () => {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    };
}

export default new SocketService();
