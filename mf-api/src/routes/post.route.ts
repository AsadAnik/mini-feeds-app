import { Router } from 'express';
import { PostController } from '../controllers';
import { PostValidation } from '../utils/validation';
import validationMiddleware from '../middlewares/validationReq.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';

const router: Router = Router();
const postController = new PostController();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management and interactions
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Text content of the post
 *     responses:
 *       201:
 *         description: Post created successfully
 */
// region POST - /posts
router.post('/', AuthMiddleware.verifyUser, validationMiddleware(PostValidation.createPost), postController.createPost);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: A list of posts
 */
// region GET - /posts
router.get('/', validationMiddleware(PostValidation.getPostsQuery), postController.getAllPosts);

/**
 * @swagger
 * /posts/{id}/like:
 *   post:
 *     summary: Like or unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Like toggled successfully
 */
// region POST - /posts/{id}/like
router.post('/:id/like', AuthMiddleware.verifyUser, validationMiddleware(PostValidation.postIdParams), postController.likePost);

/**
 * @swagger
 * /posts/{id}/comments:
 *   get:
 *     summary: Retrieve all comments for a specific post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of comments per page
 *     responses:
 *       200:
 *         description: A list of comments for the post
 */
// region GET - /posts/{id}/comments
router.get('/:id/comments', validationMiddleware(PostValidation.getComments), postController.getComments);

/**
 * @swagger
 * /posts/{id}/comment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
// region POST - /posts/{id}/comment
router.post('/:id/comment', AuthMiddleware.verifyUser, validationMiddleware(PostValidation.addComment), postController.addComment);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
// region DELETE - /posts/{id}
router.delete('/:id', AuthMiddleware.verifyUser, validationMiddleware(PostValidation.postIdParams), postController.deletePost);

/**
 * @swagger
 * /posts/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
// region DELETE - /posts/comments/{commentId}
router.delete('/comments/:commentId', AuthMiddleware.verifyUser, validationMiddleware(PostValidation.deleteComment), postController.deleteComment);

export default router;
