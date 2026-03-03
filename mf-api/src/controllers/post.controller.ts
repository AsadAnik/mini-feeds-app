import { Request, Response } from 'express';
import { PostService } from '../services';
import { StatusCodes } from 'http-status-codes';

class PostController {
    private readonly postService: PostService;

    constructor() {
        this.postService = new PostService();
    }

    /**
     * CREATE POST HANDLER
     * @param req 
     * @param res 
     * @returns 
     */
    public createPost = async (req: Request | any, res: Response) => {
        try {
            const userId = req.user.id;
            const post = await this.postService.createPost({
                content: req.body.content,
                authorId: userId
            });

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: 'Post created successfully',
                data: post
            });
        } catch (error: any) {
            console.error('Error in PostController.createPost:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error occurred while creating post'
            });
        }
    }

    /**
     * GET ALL POSTS HANDLER
     * @param req 
     * @param res 
     * @returns 
     */
    public getAllPosts = async (req: Request, res: Response) => {
        try {
            const { page, limit } = req.query;
            const result = await this.postService.getAllPosts({
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined
            });

            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Posts retrieved successfully',
                data: result.posts,
                pagination: result.pagination
            });
        } catch (error: any) {
            console.error('Error in PostController.getAllPosts:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error occurred while retrieving posts'
            });
        }
    }

    /**
     * LIKE POST HANDLER
     * @param req 
     * @param res 
     * @returns 
     */
    public likePost = async (req: Request | any, res: Response) => {
        try {
            const userId = req.user.id;
            const postId = req.params.id;

            const result = await this.postService.toggleLike({
                postId,
                userId
            });

            return res.status(StatusCodes.OK).json({
                success: true,
                ...result
            });
        } catch (error: any) {
            console.error('Error in PostController.likePost:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error occurred while liking/unliking post'
            });
        }
    }

    /**
     * ADD COMMENT HANDLER
     * @param req 
     * @param res 
     * @returns 
     */
    public addComment = async (req: Request | any, res: Response) => {
        try {
            const userId = req.user.id;
            const postId = req.params.id;
            const { content } = req.body;

            const comment = await this.postService.addComment({
                content,
                postId,
                authorId: userId
            });

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: 'Comment added successfully',
                data: comment
            });
        } catch (error: any) {
            console.error('Error in PostController.addComment:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error occurred while adding comment'
            });
        }
    }

    /**
     * DELETE POST HANDLER
     * @param req 
     * @param res 
     * @returns 
     */
    public deletePost = async (req: Request | any, res: Response) => {
        try {
            const userId = req.user.id;
            const postId = req.params.id;

            const result = await this.postService.deletePost(postId, userId);

            return res.status(StatusCodes.OK).json(result);
        } catch (error: any) {
            console.error('Error in PostController.deletePost:', error);
            const status = error.message.includes('Authorized') ? StatusCodes.FORBIDDEN : StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                success: false,
                message: error.message || 'Error occurred while deleting post'
            });
        }
    }

    /**
     * DELETE COMMENT HANDLER
     * @param req 
     * @param res 
     * @returns 
     */
    public deleteComment = async (req: Request | any, res: Response) => {
        try {
            const userId = req.user.id;
            const commentId = req.params.commentId;

            const result = await this.postService.deleteComment(commentId, userId);

            return res.status(StatusCodes.OK).json(result);
        } catch (error: any) {
            console.error('Error in PostController.deleteComment:', error);
            const status = error.message.includes('Authorized') ? StatusCodes.FORBIDDEN : StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                success: false,
                message: error.message || 'Error occurred while deleting comment'
            });
        }
    }

    /**
     * GET POST COMMENTS HANDLER
     * @param req 
     * @param res 
     * @returns 
     */
    public getComments = async (req: Request, res: Response) => {
        try {
            const postId = req.params.id as string;
            const { page, limit } = req.query;

            const result = await this.postService.getPostComments(postId, {
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined
            });

            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Comments retrieved successfully',
                data: result.comments,
                pagination: result.pagination
            });
        } catch (error: any) {
            console.error('Error in PostController.getComments:', error);
            const status = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                success: false,
                message: error.message || 'Error occurred while retrieving comments'
            });
        }
    }
}

export default PostController;
