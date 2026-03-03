export interface ICreatePost {
    content: string;
    authorId: string;
}

export interface IGetPostsQuery {
    page?: number;
    limit?: number;
}

export interface IAddComment {
    content: string;
    postId: string;
    authorId: string;
}

export interface ILikeAction {
    postId: string;
    userId: string;
}
