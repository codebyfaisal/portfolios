import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { IS_SECURE } from "../../constants.js";
import { AuthService } from "./auth.service.js";

const checkAdminExists = asyncHandler(async (req, res) => {
    const hasAdmin = await AuthService.checkAdminExists();
    return res.status(200).json(
        new ApiResponse(200, { hasAdmin }, "Admin status checked successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) throw new ApiError(400, "Password is required");

    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip || "127.0.0.1";
    const ip = rawIp.split(",")[0].trim();
    const userAgent = req.headers["user-agent"] || "Unknown";

    const { user, accessToken, refreshToken } = await AuthService.loginUser(password, { ip, userAgent });

    const options = {
        httpOnly: true,
        secure: IS_SECURE,
        sameSite: IS_SECURE ? "none" : "lax"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user,
                },
                "User logged In Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await AuthService.logoutUser(req.user._id, req.sessionId);

    const options = {
        httpOnly: true,
        secure: IS_SECURE,
        sameSite: IS_SECURE ? "none" : "lax"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

const pingSessionLogout = asyncHandler(async (req, res) => {
    if (req.sessionId && req.user?._id) {
        await AuthService.logoutUser(req.user._id, req.sessionId);
    }
    return res.status(200).json(new ApiResponse(200, {}, "Session marked inactive"));
});

const getLoginHistory = asyncHandler(async (req, res) => {
    const history = await AuthService.getLoginHistory(req.user._id, req.sessionId);
    return res.status(200).json(
        new ApiResponse(200, history, "Login history and active sessions fetched successfully")
    );
});

const revokeSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    if (!sessionId) throw new ApiError(400, "Session ID is required");

    await AuthService.revokeSession(req.user._id, sessionId);
    return res.status(200).json(
        new ApiResponse(200, {}, "Device session revoked successfully")
    );
});

const revokeAllOtherSessions = asyncHandler(async (req, res) => {
    await AuthService.revokeAllOtherSessions(req.user._id, req.sessionId);
    return res.status(200).json(
        new ApiResponse(200, {}, "All other device sessions revoked successfully")
    );
});

const revokeAllSessions = asyncHandler(async (req, res) => {
    await AuthService.revokeAllSessions(req.user._id);

    const options = {
        httpOnly: true,
        secure: IS_SECURE,
        sameSite: IS_SECURE ? "none" : "lax"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "All device sessions revoked"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is missing");
    }

    const { accessToken, refreshToken } = await AuthService.refreshAccessToken(incomingRefreshToken);

    const options = {
        httpOnly: true,
        secure: IS_SECURE,
        sameSite: IS_SECURE ? "none" : "lax"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {},
                "Access token refreshed successfully"
            )
        );
});

export {
    loginUser,
    logoutUser,
    pingSessionLogout,
    checkAdminExists,
    getLoginHistory,
    revokeSession,
    revokeAllOtherSessions,
    revokeAllSessions,
    refreshAccessToken,
};
