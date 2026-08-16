import api from "@/api/axios";

const blogsService = {
    getPosts: async (params) => {
        const response = await api.get("/posts", { params });
        return response.data.data;
    },
    getPostBySlug: async (slug) => {
        const response = await api.get(`/posts/public/${slug}`);
        return response.data.data;
    },
    createPost: async (data) => {
        const response = await api.post("/posts", data);
        return response.data.data;
    },
    updatePost: async (id, data) => {
        const response = await api.put(`/posts/${id}`, data);
        return response.data.data;
    },
    deletePost: async (id) => {
        const response = await api.delete(`/posts/${id}`);
        return response.data.data;
    },
};

export default blogsService;
