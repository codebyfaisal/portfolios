import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const DANGEROUS_EXTENSIONS = [
    "exe", "bat", "cmd", "sh", "php", "js", "py", "dll", "msi", "vbs", "ps1", "jar", "asp", "aspx", "html", "htm"
];

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
    "video/mp4",
    "video/webm",
];

const fileFilter = (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();

    // 1. Extension check against dangerous executables
    if (DANGEROUS_EXTENSIONS.includes(ext)) {
        return cb(new ApiError(400, `Files with extension .${ext} are not allowed for upload`), false);
    }

    // 2. Strict MIME type verification
    const mimeType = file.mimetype ? file.mimetype.toLowerCase() : "";
    if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
        return cb(new ApiError(400, `Invalid file type '${mimeType || "unknown"}'. Only images, PDFs, and videos are allowed.`), false);
    }

    cb(null, true);
};

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB Limit
    },
    fileFilter,
});
