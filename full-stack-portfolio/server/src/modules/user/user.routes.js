import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
    getPortfolioProfile,
    getHomeData,
    getUser,
    updateUser,
} from "./user.controller.js";
import { getConfig, updateConfig } from "./config.controller.js";

const router = Router();

router.route("/portfolio").get(getPortfolioProfile);
router.route("/portfolio/home").get(getHomeData);

router.route("/me").get(verifyJWT, getUser).put(verifyJWT, updateUser);

router.route("/me/config").get(verifyJWT, getConfig).post(verifyJWT, updateConfig)

export default router;
