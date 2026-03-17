import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ChatService from '../services/chat.service';

class ChatController {
    public getConversations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const conversations = await ChatService.getConversations(userId);

            res.status(StatusCodes.OK).json({
                message: "Conversations fetched successfully",
                data: conversations
            });
        } catch (error) {
            next(error);
        }
    };

    public getMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const conversationId = req.params.conversationId as string;
            const messages = await ChatService.getMessages(conversationId, userId);

            res.status(StatusCodes.OK).json({
                message: "Messages fetched successfully",
                data: messages
            });
        } catch (error) {
            next(error);
        }
    };

    public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const { receiverId, content } = req.body;
            const message = await ChatService.sendMessage(userId, receiverId, content);

            res.status(StatusCodes.CREATED).json({
                message: "Message sent successfully",
                data: message
            });
        } catch (error) {
            next(error);
        }
    };

    public startConversation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const { friendId } = req.body;
            const conversation = await ChatService.getOrCreateConversation(userId, friendId);

            res.status(StatusCodes.OK).json({
                message: "Conversation started successfully",
                data: conversation
            });
        } catch (error) {
            next(error);
        }
    };

    public deleteConversation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const conversationId = req.params.conversationId as string;
            const result = await ChatService.deleteConversation(conversationId, userId);

            res.status(StatusCodes.OK).json({
                message: "Conversation deleted successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    public deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const messageId = req.params.messageId as string;
            const result = await ChatService.deleteMessage(messageId, userId);

            res.status(StatusCodes.OK).json({
                message: "Message deleted successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new ChatController();
