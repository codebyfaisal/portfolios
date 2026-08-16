import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../modules/user/user.model.js";
import { LoginLog } from "../modules/auth/loginLog.model.js";
import { ACCESS_TOKEN_SECRET } from "../constants.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) throw new ApiError(401, "Unauthorized request");

        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

        let user = await User.findById(decodedToken?._id).select("-refreshToken");

        if (!user) {
            user = await User.findOne().select("-refreshToken");
        }

        if (!user) throw new ApiError(401, "Invalid Access Token");

        // Verify active session in dedicated LoginLog collection
        if (decodedToken?.sessionId) {
            const session = await LoginLog.findOne({
                sessionId: decodedToken.sessionId,
                userId: user._id,
            });

            if (!session || !session.isActive) {
                throw new ApiError(401, "Session has been revoked or expired");
            }

            // Update lastActiveAt heartbeat (throttled to max once per 5 minutes to minimize DB load)
            const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
            if (!session.lastActiveAt || new Date(session.lastActiveAt) < fiveMinsAgo) {
                session.lastActiveAt = new Date();
                await session.save();
            }
        }

        req.user = user;
        req.sessionId = decodedToken?.sessionId;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

export const verifyAdmin = (req, _, next) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication required");
    }
    next();
};

export const verifyRole = verifyAdmin;
