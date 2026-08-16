import { User } from "../user/user.model.js";
import { LoginLog } from "./loginLog.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ApiError } from "../../utils/ApiError.js";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, ADMIN_PASSWORD } from "../../constants.js";
import { UserService } from "../user/user.service.js";
import { getIpLocation } from "../../utils/geoIp.js";

const parseDeviceType = (userAgent = "") => {
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) return "Mobile";
    if (ua.includes("tablet") || ua.includes("ipad")) return "Tablet";
    return "Desktop";
};

const generateAccessAndRefereshTokens = async (userId, loginDetails = {}, existingSessionId = null) => {
    try {
        const user = await User.findById(userId);
        const sessionId = existingSessionId || crypto.randomUUID();

        const accessToken = jwt.sign(
            {
                _id: user._id,
                sessionId,
            },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: ACCESS_TOKEN_EXPIRY
            }
        );

        const refreshToken = jwt.sign(
            {
                _id: user._id,
                sessionId,
            },
            REFRESH_TOKEN_SECRET,
            {
                expiresIn: REFRESH_TOKEN_EXPIRY
            }
        );

        const refreshTokenHash = bcrypt.hashSync(refreshToken, 10);
        user.refreshToken = refreshTokenHash;
        await user.save({ validateBeforeSave: false });

        const ip = loginDetails.ip || "127.0.0.1";
        const location = getIpLocation(ip);
        const userAgent = loginDetails.userAgent || "Unknown";
        const device = parseDeviceType(userAgent);

        if (existingSessionId) {
            // Update existing device session token & lastActiveAt
            await LoginLog.updateOne(
                { sessionId: existingSessionId, userId: user._id },
                {
                    $set: {
                        refreshTokenHash,
                        lastActiveAt: new Date(),
                        isActive: true
                    }
                }
            );
        } else {
            // Create new device session log in dedicated LoginLog collection
            await LoginLog.create({
                userId: user._id,
                sessionId,
                refreshTokenHash,
                ip,
                location,
                userAgent,
                device,
                loggedInAt: new Date(),
                lastActiveAt: new Date(),
                isActive: true,
            });
        }

        // Auto-purge records for this user older than 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await LoginLog.deleteMany({
            userId: user._id,
            loggedInAt: { $lt: thirtyDaysAgo }
        });

        return { accessToken, refreshToken, sessionId };

    } catch (error) {
        console.error("Token generation failed:", error);
        throw new ApiError(500, "Failed to generate access and refresh tokens");
    }
};

const checkAdminExists = async () => {
    const count = await User.countDocuments();
    return count > 0;
};

const loginUser = async (password, loginDetails = {}) => {
    const targetPassword = ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

    const isMatch = targetPassword.startsWith("$2a$") || targetPassword.startsWith("$2b$")
        ? bcrypt.compareSync(password, targetPassword)
        : password === targetPassword;

    if (!isMatch) {
        throw new ApiError(401, "Invalid password");
    }

    const user = await UserService.getPortfolioUser();

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id, loginDetails);
    const loggedInUser = await User.findById(user._id).select("-refreshToken");

    return { user: loggedInUser, accessToken, refreshToken };
};

const logoutUser = async (userId, sessionId) => {
    if (sessionId) {
        await LoginLog.updateOne(
            { userId, sessionId },
            { $set: { isActive: false } }
        );
    } else {
        await LoginLog.updateMany(
            { userId },
            { $set: { isActive: false } }
        );
    }
};

const getLoginHistory = async (userId, currentSessionId) => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const ACTIVE_THRESHOLD_MS = 10 * 60 * 1000; // Active within last 10 mins
    const now = Date.now();

    const rawLogs = await LoginLog.find({
        userId,
        loggedInAt: { $gte: thirtyDaysAgo }
    }).sort({ loggedInAt: -1 });

    const sessions = rawLogs.map(s => {
        const isCurrent = s.sessionId === currentSessionId;
        const isRecentlyActive = s.isActive && (isCurrent || (now - new Date(s.lastActiveAt).getTime() < ACTIVE_THRESHOLD_MS));
        return {
            _id: s._id,
            sessionId: s.sessionId,
            ip: s.ip,
            location: s.location,
            userAgent: s.userAgent,
            device: s.device,
            loggedInAt: s.loggedInAt,
            lastActiveAt: s.lastActiveAt,
            isActive: isRecentlyActive,
            isCurrent,
        };
    });

    return {
        sessions,
        totalLogins30Days: sessions.length,
        activeDevicesCount: sessions.filter(s => s.isActive).length,
    };
};

const revokeSession = async (userId, targetSessionId) => {
    await LoginLog.updateOne(
        { userId, sessionId: targetSessionId },
        { $set: { isActive: false } }
    );
    return true;
};

const revokeAllOtherSessions = async (userId, currentSessionId) => {
    if (currentSessionId) {
        await LoginLog.updateMany(
            { userId, sessionId: { $ne: currentSessionId } },
            { $set: { isActive: false } }
        );
    } else {
        await LoginLog.updateMany(
            { userId },
            { $set: { isActive: false } }
        );
    }
    return true;
};

const revokeAllSessions = async (userId) => {
    await LoginLog.updateMany(
        { userId },
        { $set: { isActive: false } }
    );
    return true;
};

const refreshAccessToken = async (incomingRefreshToken) => {
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user || !decodedToken?.sessionId) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        const session = await LoginLog.findOne({
            sessionId: decodedToken.sessionId,
            userId: user._id,
            isActive: true,
        });

        if (!session) {
            throw new ApiError(401, "Session has been revoked or expired");
        }

        const isMatch = bcrypt.compareSync(incomingRefreshToken, session.refreshTokenHash);
        if (!isMatch) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // Generate fresh accessToken for existing sessionId without mutating refresh token hash
        const accessToken = jwt.sign(
            {
                _id: user._id,
                sessionId: session.sessionId,
            },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: ACCESS_TOKEN_EXPIRY,
            }
        );

        // Update heartbeat on existing session
        session.lastActiveAt = new Date();
        await session.save();

        return { accessToken, refreshToken: incomingRefreshToken };
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
};

export const AuthService = {
    checkAdminExists,
    loginUser,
    logoutUser,
    getLoginHistory,
    revokeSession,
    revokeAllOtherSessions,
    revokeAllSessions,
    refreshAccessToken,
};
