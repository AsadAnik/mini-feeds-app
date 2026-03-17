import { Router } from 'express';
import ChatController from '../controllers/chat.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Messaging and Conversations
 */

/**
 * @swagger
 * /chat/conversations:
 *   get:
 *     summary: Get all conversations for current user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations fetched successfully
 */
router.get('/conversations', AuthMiddleware.verifyUser, ChatController.getConversations);

/**
 * @swagger
 * /chat/messages/{conversationId}:
 *   get:
 *     summary: Get all messages in a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 */
router.get('/messages/:conversationId', AuthMiddleware.verifyUser, ChatController.getMessages);

/**
 * @swagger
 * /chat/send:
 *   post:
 *     summary: Send a message to a friend
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - content
 *             properties:
 *               receiverId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post('/send', AuthMiddleware.verifyUser, ChatController.sendMessage);

/**
 * @swagger
 * /chat/start:
 *   post:
 *     summary: Start or get an existing conversation with a friend
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - friendId
 *             properties:
 *               friendId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conversation started successfully
 */
router.post('/start', AuthMiddleware.verifyUser, ChatController.startConversation);

/**
 * @swagger
 * /chat/conversation/{conversationId}:
 *   delete:
 *     summary: Delete a conversation and all its messages
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation deleted successfully
 */
router.delete('/conversation/:conversationId', AuthMiddleware.verifyUser, ChatController.deleteConversation);

/**
 * @swagger
 * /chat/message/{messageId}:
 *   delete:
 *     summary: Delete an individual message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 */
router.delete('/message/:messageId', AuthMiddleware.verifyUser, ChatController.deleteMessage);

export default router;
