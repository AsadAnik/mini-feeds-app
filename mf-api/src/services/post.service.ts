import PrismaClient from '../prisma';
import { ICreatePost, IGetPostsQuery, IAddComment, ILikeAction } from '../types/post.types';
import { ApiError } from '../utils/errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import NotificationService from './notification.service';

class PostService {
    /**
     * CREATE NEW POST
     * @param data 
     * @returns 
     */
    // region CREATE POST
    public async createPost(data: ICreatePost) {
        try {
            const post = await PrismaClient.post.create({
                data: {
                    content: data.content,
                    authorId: data.authorId
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true
                        }
                    }
                }
            });
            return post;
        } catch (error) {
            console.error('Error in createPost service:', error);
            throw error;
        }
    }

    /**
     * RETRIEVE ALL POSTS
     * Paginated, newest first.
     * @param query 
     * @returns 
     */
    // region GET ALL POSTS
    public async getAllPosts(query: IGetPostsQuery) {
        try {
            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 10;
            const skip = (page - 1) * limit;

            const [posts, total] = await Promise.all([
                PrismaClient.post.findMany({
                    skip,
                    take: limit,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                email: true
                            }
                        },
                        _count: {
                            select: {
                                likes: true,
                                comments: true
                            }
                        }
                    }
                }),
                PrismaClient.post.count()
            ]);

            return {
                posts,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Error in getAllPosts service:', error);
            throw error;
        }
    }

    /**
     * LIKE OR UNLIKE A POST
     * Toggles like state for a post.
     * @param action 
     * @returns 
     */
    // region TOGGLE LIKE
    public async toggleLike(action: ILikeAction) {
        try {
            // Check if post exists
            const post = await PrismaClient.post.findUnique({ where: { id: action.postId } });
            if (!post) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found');
            }

            // Check if already liked
            const existingLike = await PrismaClient.like.findUnique({
                where: {
                    userId_postId: {
                        userId: action.userId,
                        postId: action.postId
                    }
                }
            });

            if (existingLike) {
                // Unlike if already exists
                await PrismaClient.like.delete({
                    where: { id: existingLike.id }
                });
                return { liked: false, message: 'Post unliked successfully' };
            } else {
                // Like if not already liked
                await PrismaClient.like.create({
                    data: {
                        userId: action.userId,
                        postId: action.postId
                    }
                });

                // Send notification to post author
                const postWithAuthor = await PrismaClient.post.findUnique({
                    where: { id: action.postId },
                    include: { author: true }
                });

                if (postWithAuthor && postWithAuthor.authorId !== action.userId) {
                    const liker = await PrismaClient.user.findUnique({ where: { id: action.userId } });
                    const notificationText = `${liker?.fullName || 'Someone'} liked your post.`;

                    if (postWithAuthor.author.fcmToken) {
                        NotificationService.sendPushNotification(
                            postWithAuthor.author.fcmToken,
                            'New Like!',
                            notificationText,
                            { postId: action.postId, type: 'like' }
                        );
                    }

                    // Save to database
                    await NotificationService.saveNotificationToDatabase(
                        postWithAuthor.authorId,
                        action.userId,
                        'like',
                        notificationText,
                        action.postId
                    );
                }

                return { liked: true, message: 'Post liked successfully' };
            }
        } catch (error) {
            console.error('Error in toggleLike service:', error);
            throw error;
        }
    }

    /**
     * ADD A COMMENT TO A POST
     * @param data 
     * @returns 
     */
    // region ADD COMMENT
    public async addComment(data: IAddComment) {
        try {
            // Check if post exists
            const post = await PrismaClient.post.findUnique({ where: { id: data.postId } });
            if (!post) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found');
            }

            const comment = await PrismaClient.comment.create({
                data: {
                    content: data.content,
                    postId: data.postId,
                    authorId: data.authorId
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    }
                }
            });

            // Send notification to post author
            const postWithAuthor = await PrismaClient.post.findUnique({
                where: { id: data.postId },
                include: { author: true }
            });

            if (postWithAuthor && postWithAuthor.authorId !== data.authorId) {
                const notificationText = `${comment.author.fullName || 'Someone'} commented on your post.`;

                if (postWithAuthor.author.fcmToken) {
                    NotificationService.sendPushNotification(
                        postWithAuthor.author.fcmToken,
                        'New Comment!',
                        `${comment.author.fullName || 'Someone'} commented on your post: "${data.content.substring(0, 30)}${data.content.length > 30 ? '...' : ''}"`,
                        { postId: data.postId, type: 'comment' }
                    );
                }

                // Save to database
                await NotificationService.saveNotificationToDatabase(
                    postWithAuthor.authorId,
                    data.authorId,
                    'comment',
                    notificationText,
                    data.postId
                );
            }

            return comment;
        } catch (error) {
            console.error('Error in addComment service:', error);
            throw error;
        }
    }

    /**
     * DELETE A POST
     * @param {string} postId 
     * @param {string} userId 
     * @returns 
     */
    // region DELETE POST
    public async deletePost(postId: string, userId: string) {
        try {
            const post = await PrismaClient.post.findUnique({ where: { id: postId } });
            if (!post) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found');
            }

            // Check Ownership
            if (post.authorId !== userId) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'Authorized Access: You can only delete your own posts');
            }

            await PrismaClient.post.delete({ where: { id: postId } });
            return { success: true, message: 'Post deleted successfully' };

        } catch (error) {
            console.error('Error in deletePost service:', error);
            throw error;
        }
    }

    /**
     * DELETE A COMMENT
     * @param {string} commentId 
     * @param {string} userId 
     * @returns 
     */
    // region DELETE COMMENT
    public async deleteComment(commentId: string, userId: string) {
        try {
            const comment = await PrismaClient.comment.findUnique({ where: { id: commentId } });
            if (!comment) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Comment not found');
            }

            // Check Ownership
            if (comment.authorId !== userId) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'Authorized Access: You can only delete your own comments');
            }

            await PrismaClient.comment.delete({ where: { id: commentId } });
            return { success: true, message: 'Comment deleted successfully' };

        } catch (error) {
            console.error('Error in deleteComment service:', error);
            throw error;
        }
    }

    /**
     * GET COMMENTS FOR A POST
     * @param postId 
     * @param query 
     * @returns 
     */
    // region GET COMMENTS
    public async getPostComments(postId: string, query: IGetPostsQuery) {
        try {
            // Check if post exists
            const post = await PrismaClient.post.findUnique({ where: { id: postId } });
            if (!post) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found');
            }

            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 10;
            const skip = (page - 1) * limit;

            const [comments, total] = await Promise.all([
                PrismaClient.comment.findMany({
                    where: { postId },
                    skip,
                    take: limit,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                email: true
                            }
                        }
                    }
                }),
                PrismaClient.comment.count({ where: { postId } })
            ]);

            return {
                comments,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Error in getPostComments service:', error);
            throw error;
        }
    }
}

export default PostService;
