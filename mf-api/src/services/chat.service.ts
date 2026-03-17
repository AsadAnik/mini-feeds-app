import PrismaClient from '../prisma';
import { ApiError } from '../utils/errors/ApiError';
import { StatusCodes } from 'http-status-codes';

class ChatService {
    /**
     * Get all conversations for a user
     * Includes participant details and the last message
     */
    // region Get Conversations
    public getConversations = async (userId: string) => {
        try {
            const conversations = await PrismaClient.conversation.findMany({
                where: {
                    participants: {
                        some: { id: userId }
                    }
                },
                include: {
                    participants: {
                        where: {
                            id: { not: userId }
                        },
                        select: {
                            id: true,
                            fullName: true,
                            username: true,
                            avatarConfig: true,
                        }
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            });

            return conversations.map(conv => ({
                id: conv.id,
                otherParticipant: conv.participants[0],
                lastMessage: conv.messages[0] || null,
                updatedAt: conv.updatedAt
            }));
        } catch (error) {
            console.error(`Error in getConversations: ${error}`);
            throw error;
        }
    };

    /**
     * Get messages for a conversation
     */
    // region Get Messages
    public getMessages = async (conversationId: string, userId: string) => {
        try {
            // Verify user is participant
            const conv = await PrismaClient.conversation.findUnique({
                where: { id: conversationId },
                include: { participants: { select: { id: true } } }
            });

            if (!conv) throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
            if (!conv.participants.some(p => p.id === userId)) {
                throw new ApiError(StatusCodes.FORBIDDEN, "Access denied");
            }

            return await PrismaClient.message.findMany({
                where: { conversationId },
                orderBy: { createdAt: 'asc' }
            });
        } catch (error) {
            console.error(`Error in getMessages: ${error}`);
            throw error;
        }
    };

    /**
     * Send message
     * If conversation doesn't exist, create one
     */
    // region Send Message
    public sendMessage = async (senderId: string, receiverId: string, content: string) => {
        try {
            if (senderId === receiverId) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Cannot message yourself");
            }

            // Check if they are friends
            const friendship = await PrismaClient.friendship.findUnique({
                where: {
                    userId_friendId: { userId: senderId, friendId: receiverId }
                }
            });

            if (!friendship) {
                throw new ApiError(StatusCodes.FORBIDDEN, "You can only message your friends");
            }

            // Find or create conversation
            let conversation = await PrismaClient.conversation.findFirst({
                where: {
                    AND: [
                        { participants: { some: { id: senderId } } },
                        { participants: { some: { id: receiverId } } }
                    ]
                }
            });

            if (!conversation) {
                conversation = await PrismaClient.conversation.create({
                    data: {
                        participants: {
                            connect: [
                                { id: senderId },
                                { id: receiverId }
                            ]
                        }
                    }
                });
            }

            const message = await PrismaClient.message.create({
                data: {
                    content,
                    senderId,
                    conversationId: conversation.id
                }
            });

            // Update conversation updatedAt
            await PrismaClient.conversation.update({
                where: { id: conversation.id },
                data: { updatedAt: new Date() }
            });

            // Emit to socket
            try {
                const { getIO } = require('../lib/socket');
                const io = getIO();
                io.to(conversation.id).emit('new_message', message);

            } catch (socketError) {
                console.warn('Socket emit failed, continuing...', socketError);
            }

            // Send Push Notification
            try {
                const receiver = await PrismaClient.user.findUnique({
                    where: { id: receiverId },
                    select: { fcmToken: true, fullName: true }
                });

                const sender = await PrismaClient.user.findUnique({
                    where: { id: senderId },
                    select: { fullName: true }
                });

                if (receiver?.fcmToken) {
                    const { default: notificationService } = require('./notification.service');
                    await notificationService.sendPushNotification(
                        receiver.fcmToken,
                        sender?.fullName || 'New Message',
                        content,
                        { conversationId: conversation.id, type: 'chat' }
                    );
                }
            } catch (notifError) {
                console.warn('Push notification failed, continuing...', notifError);
            }

            return message;
        } catch (error) {
            console.error(`Error in sendMessage: ${error}`);
            throw error;
        }
    };

    /**
     * Get or create conversation (helper for starting chat from friend list)
     */
    // region Get or Create Conversation
    public getOrCreateConversation = async (userId: string, friendId: string) => {
        try {
            let conversation = await PrismaClient.conversation.findFirst({
                where: {
                    AND: [
                        { participants: { some: { id: userId } } },
                        { participants: { some: { id: friendId } } }
                    ]
                },
                include: {
                    participants: {
                        where: { id: { not: userId } },
                        select: { id: true, fullName: true, username: true, avatarConfig: true }
                    }
                }
            });

            if (!conversation) {
                conversation = await PrismaClient.conversation.create({
                    data: {
                        participants: {
                            connect: [{ id: userId }, { id: friendId }]
                        }
                    },
                    include: {
                        participants: {
                            where: { id: { not: userId } },
                            select: { id: true, fullName: true, username: true, avatarConfig: true }
                        }
                    }
                });
            }

            return {
                id: conversation.id,
                otherParticipant: conversation.participants[0]
            };
        } catch (error) {
            console.error(`Error in getOrCreateConversation: ${error}`);
            throw error;
        }
    };

    /**
     * Delete conversation and all its messages
     */
    // region Delete Conversation
    public deleteConversation = async (conversationId: string, userId: string) => {
        try {
            // Verify conversation exists and user is participant
            const conv = await PrismaClient.conversation.findUnique({
                where: { id: conversationId },
                include: { participants: { select: { id: true } } }
            });

            if (!conv) throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
            if (!conv.participants.some(p => p.id === userId)) {
                throw new ApiError(StatusCodes.FORBIDDEN, "Access denied");
            }

            // Delete conversation (messages will be deleted due to Cascade)
            await PrismaClient.conversation.delete({
                where: { id: conversationId }
            });

            return { id: conversationId };
        } catch (error) {
            console.error(`Error in deleteConversation: ${error}`);
            throw error;
        }
    };

    /**
     * Delete individual message
     */
    // region Delete Message
    public deleteMessage = async (messageId: string, userId: string) => {
        try {
            const message = await PrismaClient.message.findUnique({
                where: { id: messageId }
            });

            if (!message) throw new ApiError(StatusCodes.NOT_FOUND, "Message not found");
            if (message.senderId !== userId) {
                throw new ApiError(StatusCodes.FORBIDDEN, "You can only delete your own messages");
            }

            await PrismaClient.message.delete({
                where: { id: messageId }
            });

            return { id: messageId };
        } catch (error) {
            console.error(`Error in deleteMessage: ${error}`);
            throw error;
        }
    };
}

export default new ChatService();
