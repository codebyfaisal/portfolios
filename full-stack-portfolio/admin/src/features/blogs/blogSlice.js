import blogsService from './blogs.service';

export const createBlogSlice = (set, get) => ({
    posts: [],
    currentPost: null,
    blogRequestId: null,

    fetchPosts: async (params) => {
        const requestId = Date.now();
        set({ isLoading: true, blogRequestId: requestId });
        try {
            const data = await blogsService.getPosts(params);
            if (get().blogRequestId === requestId) {
                set({ posts: data.posts || [] });
            }
            return data;
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error("Failed to fetch posts", error);
            }
        } finally {
            if (get().blogRequestId === requestId) {
                set({ isLoading: false });
            }
        }
    },

    getPostBySlug: async (slug) => {
        const requestId = Date.now();
        set({ isLoading: true, blogRequestId: requestId });
        try {
            const post = await blogsService.getPostBySlug(slug);
            if (get().blogRequestId === requestId) {
                set({ currentPost: post });
            }
            return post;
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error("Failed to fetch post", error);
            }
        } finally {
            if (get().blogRequestId === requestId) {
                set({ isLoading: false });
            }
        }
    },

    createPost: async (postData) => {
        set({ isLoading: true });
        try {
            const newPost = await blogsService.createPost(postData);
            set((state) => ({
                posts: [newPost, ...state.posts]
            }));
            return newPost;
        } catch (error) {
            console.error("Failed to create post", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updatePost: async (id, postData) => {
        set({ isLoading: true });
        try {
            const updatedPost = await blogsService.updatePost(id, postData);
            set((state) => ({
                posts: state.posts.map((p) => (p._id === id ? updatedPost : p)),
                currentPost: (state.currentPost && state.currentPost._id === id) ? updatedPost : state.currentPost
            }));
            return updatedPost;
        } catch (error) {
            console.error("Failed to update post", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deletePost: async (id) => {
        set({ isLoading: true });
        try {
            await blogsService.deletePost(id);
            set((state) => ({
                posts: state.posts.filter((p) => p._id !== id)
            }));
        } catch (error) {
            console.error("Failed to delete post", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    resetBlogState: () => {
        set({ posts: [], isLoading: true, currentPost: null });
    },
});
