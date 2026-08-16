import { deleteFromCloudinary, getCloudinaryResources, uploadOnCloudinary } from "../../services/cloudinary.service.js";
import { ApiError } from "../../utils/ApiError.js";

const getFiles = async (resourceType, nextCursor) => {
    return await getCloudinaryResources(resourceType, nextCursor);
};

const deleteFile = async (publicId) => {
    const result = await deleteFromCloudinary(publicId);
    if (!result) throw new ApiError(500, "Failed to delete media");
    return result;
};

const uploadFile = async (fileBuffer) => {
    const result = await uploadOnCloudinary(fileBuffer);
    if (!result) throw new ApiError(500, "Failed to upload media");
    return result;
};

export const FileService = {
    getFiles,
    deleteFile,
    uploadFile
};
