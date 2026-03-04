import { create } from 'zustand';

export interface Post {
    id: string;
    author: {
        id: string;
        username: string;
        fullName: string;
        avatarUrl: string;
    };
    content: string;
    likes: number;
    commentsOriginal: number;
    createdAt: string;
    isLikedByMe: boolean;
}

interface FeedState {
    posts: Post[];
    addPost: (post: Omit<Post, 'id' | 'likes' | 'commentsOriginal' | 'isLikedByMe' | 'createdAt'>) => void;
    toggleLike: (postId: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const mockPosts: Post[] = [
    {
        id: '1',
        author: {
            id: '101',
            username: 'janesmith',
            fullName: 'Jane Smith',
            avatarUrl: 'https://i.pravatar.cc/150?u=b042581f4e29026704d'
        },
        content: 'Just launched my new app! So excited to share it with the world. Let me know what you think! 🚀🔥',
        likes: 42,
        commentsOriginal: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isLikedByMe: false,
    },
    {
        id: '2',
        author: {
            id: '102',
            username: 'mike_dev',
            fullName: 'Mike Developer',
            avatarUrl: 'https://i.pravatar.cc/150?u=c042581f4e29026704d'
        },
        content: 'React Native vs Flutter? What is your choice for 2026? I am leaning heavily towards React Native because of the mature ecosystem and OTA updates.',
        likes: 128,
        commentsOriginal: 34,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        isLikedByMe: true,
    },
    {
        id: '3',
        author: {
            id: '103',
            username: 'sarah_ui',
            fullName: 'Sarah UI',
            avatarUrl: 'https://i.pravatar.cc/150?u=d042581f4e29026704d'
        },
        content: 'Design tip: Whitespace is your friend. Do not be afraid to let your UI breathe! ✨',
        likes: 89,
        commentsOriginal: 12,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        isLikedByMe: false,
    }
];

export const useFeedStore = create<FeedState>((set) => ({
    posts: mockPosts,
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    addPost: (postData) => set((state) => ({
        posts: [
            {
                id: Math.random().toString(36).substring(7),
                ...postData,
                likes: 0,
                commentsOriginal: 0,
                createdAt: new Date().toISOString(),
                isLikedByMe: false,
            },
            ...state.posts,
        ]
    })),
    toggleLike: (postId) => set((state) => ({
        posts: state.posts.map((post) => {
            if (post.id === postId) {
                return {
                    ...post,
                    isLikedByMe: !post.isLikedByMe,
                    likes: post.isLikedByMe ? post.likes - 1 : post.likes + 1,
                }
            }
            return post;
        })
    }))
}));
