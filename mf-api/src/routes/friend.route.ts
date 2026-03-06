import { Router } from 'express';
import FriendController from '../controllers/friend.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router: Router = Router();
const friendController = new FriendController();

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Friend management and exploration
 */

/**
 * @swagger
 * /friends/explore:
 *   get:
 *     summary: Get users to potentially friend
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for name or username
 *     responses:
 *       200:
 *         description: Explore people fetched successfully
 */
// region GET - /friends/explore
router.get('/explore', AuthMiddleware.verifyUser, friendController.explorePeople);

/**
 * @swagger
 * /friends:
 *   get:
 *     summary: Get all friends of current user
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for name or username
 *     responses:
 *       200:
 *         description: Friends fetched successfully
 */
// region GET - /friends
router.get('/', AuthMiddleware.verifyUser, friendController.getFriends);

/**
 * @swagger
 * /friends/requests:
 *   get:
 *     summary: Get all pending friend requests for current user
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending requests fetched successfully
 */
// region GET - /friends/requests
router.get('/requests', AuthMiddleware.verifyUser, friendController.getPendingRequests);

/**
 * @swagger
 * /friends/request:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friends]
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
 *             properties:
 *               receiverId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 */
// region POST - /friends/request
router.post('/request', AuthMiddleware.verifyUser, friendController.sendFriendRequest);

/**
 * @swagger
 * /friends/request/{requestId}/accept:
 *   post:
 *     summary: Accept a friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 */
// region POST - /friends/request/{requestId}/accept
router.post('/request/:requestId/accept', AuthMiddleware.verifyUser, friendController.acceptFriendRequest);

/**
 * @swagger
 * /friends/request/{requestId}/reject:
 *   post:
 *     summary: Reject a friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friend request rejected successfully
 */
// region POST - /friends/request/{requestId}/reject
router.post('/request/:requestId/reject', AuthMiddleware.verifyUser, friendController.rejectFriendRequest);

/**
 * @swagger
 * /friends/{friendId}:
 *   delete:
 *     summary: Unfriend a user
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unfriended successfully
 */
// region DELETE - /friends/{friendId}
router.delete('/:friendId', AuthMiddleware.verifyUser, friendController.unfriend);

export default router;
