import { create } from 'zustand';
import { api } from '../services/api';

export interface PostAuthor {
    id: string;
    email: string;
    username?: string;
    fullName?: string;
}

export interface Post {
    id: string;
    content: string;
    authorId: string;
    author: PostAuthor;
    createdAt: string;
    updatedAt: string;
    _count: {
        likes: number;
        comments: number;
    };
    isLikedByMe?: boolean;
}

export interface Comment {
    id: string;
    content: string;
    authorId: string;
    postId: string;
    author: PostAuthor;
    createdAt: string;
    updatedAt: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface FeedState {
    // Posts / feed
    posts: Post[];
    pagination: Pagination | null;
    isLoadingPosts: boolean;
    isFetchingMore: boolean;
    searchQuery: string;

    // Actions
    fetchPosts: (page?: number, replace?: boolean) => Promise<void>;
    fetchMorePosts: () => Promise<void>;
    toggleLike: (postId: string) => Promise<void>;
    deletePost: (postId: string) => Promise<void>;
    addPostLocally: (post: Post) => void;
    setSearchQuery: (query: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
    posts: [],
    pagination: null,
    isLoadingPosts: false,
    isFetchingMore: false,
    searchQuery: '',

    setSearchQuery: (query) => set({ searchQuery: query }),

    // region Fetch Posts
    fetchPosts: async (page = 1, replace = true) => {
        if (replace) set({ isLoadingPosts: true });
        else set({ isFetchingMore: true });

        try {
            const response = await api.get(`/posts?page=${page}&limit=10`);
            if (response.data?.success) {
                const newPosts: Post[] = response.data.data;
                set((state) => ({
                    posts: replace ? newPosts : [...state.posts, ...newPosts],
                    pagination: response.data.pagination,
                }));
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            set({ isLoadingPosts: false, isFetchingMore: false });
        }
    },

    // region Fetch More Posts (Infinite Scroll)
    fetchMorePosts: async () => {
        const { pagination, isFetchingMore, isLoadingPosts, fetchPosts } = get();
        if (isFetchingMore || isLoadingPosts) return;
        if (!pagination || pagination.page >= pagination.totalPages) return;

        await fetchPosts(pagination.page + 1, false);
    },

    // region Toggle Like
    toggleLike: async (postId: string) => {
        // Optimistic update
        set((state) => ({
            posts: state.posts.map((p) =>
                p.id === postId
                    ? {
                        ...p,
                        isLikedByMe: !p.isLikedByMe,
                        _count: {
                            ...p._count,
                            likes: p.isLikedByMe
                                ? p._count.likes - 1
                                : p._count.likes + 1,
                        },
                    }
                    : p
            ),
        }));

        try {
            await api.post(`/posts/${postId}/like`);
        } catch (error) {
            // Revert on failure
            set((state) => ({
                posts: state.posts.map((p) =>
                    p.id === postId
                        ? {
                            ...p,
                            isLikedByMe: !p.isLikedByMe,
                            _count: {
                                ...p._count,
                                likes: p.isLikedByMe
                                    ? p._count.likes - 1
                                    : p._count.likes + 1,
                            },
                        }
                        : p
                ),
            }));
            console.error('Error toggling like:', error);
        }
    },

    // region Delete Post
    deletePost: async (postId: string) => {
        try {
            await api.delete(`/posts/${postId}`);
            set((state) => ({
                posts: state.posts.filter((p) => p.id !== postId),
            }));
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    },

    // region Add Post (used after creating a new post)
    addPostLocally: (post: Post) => {
        set((state) => ({ posts: [post, ...state.posts] }));
    },
}));
