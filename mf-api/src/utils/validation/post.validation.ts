import { z } from 'zod';

class PostValidation {
    /**
     * CREATE POST SCHEMA
     */
    static createPost = z.object({
        body: z.object({
            content: z.string().min(1, 'Content is required').max(500, 'Content must be under 500 characters')
        })
    });

    /**
     * PAGINATION SCHEMA
     */
    static getPostsQuery = z.object({
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional()
        })
    });

    /**
     * POST COMMENT SCHEMA
     */
    static addComment = z.object({
        body: z.object({
            content: z.string().min(1, 'Comment is required').max(300, 'Comment must be under 300 characters')
        }),
        params: z.object({
            id: z.string().uuid('Invalid Post ID format')
        })
    });

    /**
     * POST ID PARAMS SCHEMA (Like Action)
     */
    static postIdParams = z.object({
        params: z.object({
            id: z.string().uuid('Invalid Post ID format')
        })
    });

    /**
     * DELETE COMMENT SCHEMA
     */
    static deleteComment = z.object({
        params: z.object({
            commentId: z.string().uuid('Invalid Comment ID format')
        })
    });

    /**
     * GET COMMENTS SCHEMA
     */
    static getComments = z.object({
        params: z.object({
            id: z.string().uuid('Invalid Post ID format')
        }),
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional()
        })
    });
}

export default PostValidation;
