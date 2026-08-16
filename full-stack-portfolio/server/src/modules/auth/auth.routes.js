import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
    loginUser,
    logoutUser,
    pingSessionLogout,
    checkAdminExists,
    getLoginHistory,
    revokeSession,
    revokeAllOtherSessions,
    revokeAllSessions,
    refreshAccessToken,
} from "./auth.controller.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/admin-exists").get(checkAdminExists);
router.route("/refresh").post(refreshAccessToken);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/sessions/ping-logout").post(verifyJWT, pingSessionLogout);
router.route("/login-history").get(verifyJWT, getLoginHistory);
router.route("/sessions/revoke/:sessionId").post(verifyJWT, revokeSession);
router.route("/sessions/revoke-others").post(verifyJWT, revokeAllOtherSessions);
router.route("/sessions/revoke-all").post(verifyJWT, revokeAllSessions);

export default router;
