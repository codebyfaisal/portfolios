import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { FileService } from "./file.service.js";

const getFiles = asyncHandler(async (req, res) => {
    const { resourceType = "image", nextCursor } = req.query;
    const data = await FileService.getFiles(resourceType, nextCursor);

    return res.status(200).json(
        new ApiResponse(200, data, "Media fetched successfully")
    );
});

const deleteFile = asyncHandler(async (req, res) => {
    const { publicId } = req.params;
    if (!publicId) throw new ApiError(400, "Public ID is required");

    const result = await FileService.deleteFile(publicId);

    return res.status(200).json(
        new ApiResponse(200, result, "Media deleted successfully")
    );
});

const uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "File is required");

    const result = await FileService.uploadFile(req.file.buffer);

    return res.status(201).json(
        new ApiResponse(201, result, "Media uploaded successfully")
    );
});

export { getFiles, deleteFile, uploadFile };
