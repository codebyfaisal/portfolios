import api from "@/api/axios";

const filesService = {
    getFiles: async (resourceType, nextCursor) => {
        const params = { resourceType };
        if (nextCursor) params.next_cursor = nextCursor;
        const response = await api.get("/files", { params });
        return response.data.data;
    },
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post("/files", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.data;
    },
    deleteFile: async (publicId) => {
        const encodedId = encodeURIComponent(publicId);
        const response = await api.delete(`/files/${encodedId}`);
        return response.data.data;
    },
};

export default filesService;
