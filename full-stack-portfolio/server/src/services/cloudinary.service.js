import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER } from "../constants.js";

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadOnCloudinary = async (fileBuffer) => {
    if (!fileBuffer) return null;

    return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: CLOUDINARY_FOLDER || "portfolio",
                resource_type: "auto",
            },
            (error, result) => {
                if (error) return reject(error);
                if (result.secure_url) {
                    result.url = result.secure_url;
                }
                resolve(result);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return new Error("Public ID is required");

    const result = await cloudinary.uploader.destroy(publicId);
    if (!result || result.result !== "ok" || result.deleted < 1)
        throw new Error("Failed to delete from Cloudinary.\nMay delete possible from Cloudinary dashboard");

    return result;

};

const getCloudinaryResources = async (resourceType = "all", next_cursor = null) => {
    const folderName = CLOUDINARY_FOLDER || "portfolio";
    const folderFilter = `folder:"${folderName}*"`;
    let expression = "";

    const type = (resourceType || "").toLowerCase();

    switch (type) {
        case "images":
        case "image":
            expression = `${folderFilter} AND resource_type:image AND NOT format:pdf`;
            break;
        case "videos":
        case "video":
            expression = `${folderFilter} AND resource_type:video`;
            break;
        case "pdf":
            expression = `${folderFilter} AND resource_type:image AND format:pdf`;
            break;
        case "others":
        case "other":
            expression = `${folderFilter} AND resource_type:raw`;
            break;
        case "all":
        default:
            expression = folderFilter;
            break;
    }

    let search = cloudinary.search
        .expression(expression)
        .sort_by("created_at", "desc")
        .max_results(30);

    if (next_cursor) search = search.next_cursor(next_cursor);

    const result = await search.execute();

    if (result.resources) {
        result.resources = result.resources.map(resource => ({
            ...resource,
            url: resource.secure_url || resource.url.replace(/^http:\/\//, "https://")
        }));
    }

    return result;
};

export { uploadOnCloudinary, deleteFromCloudinary, getCloudinaryResources };
