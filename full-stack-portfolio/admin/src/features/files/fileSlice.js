import filesService from './files.service';
import { getErrorMessage } from "@/store/utils";

export const createFileSlice = (set, get) => ({
    isLoadingFiles: false,

    fetchFiles: async (resourceType = "image", nextCursor = null) => {
        set({ isLoadingFiles: true });
        try {
            const data = await filesService.getFiles(resourceType, nextCursor);
            set({ isLoadingFiles: false });
            return data;
        } catch (error) {
            set({ isLoadingFiles: false });
            throw error;
        }
    },

    uploadFile: async (file) => {
        set({ isLoadingFiles: true });
        try {
            const newMedia = await filesService.uploadFile(file);
            set({ isLoadingFiles: false });
            return newMedia;
        } catch (error) {
            set({ isLoadingFiles: false });
            throw new Error(getErrorMessage(error));
        }
    },

    deleteFile: async (publicId) => {
        set({ isLoadingFiles: true });
        try {
            const result = await filesService.deleteFile(publicId);
            set({ isLoadingFiles: false });
            return result;
        } catch (error) {
            set({ isLoadingFiles: false });
            throw new Error(getErrorMessage(error));
        }
    },
});
