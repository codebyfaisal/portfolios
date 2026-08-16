import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { deleteFile, getFiles, uploadFile } from "./file.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .get(getFiles)
    .post(upload.single("file"), uploadFile);

router.route("/:publicId")
    .delete(deleteFile);

export default router;
