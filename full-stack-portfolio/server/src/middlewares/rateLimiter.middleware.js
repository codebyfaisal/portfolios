import rateLimit from "express-rate-limit";
import {
    ENABLE_RATE_LIMIT,
    RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_GLOBAL_MAX,
    RATE_LIMIT_STRICT_MAX,
} from "../constants.js";

const passThrough = (req, res, next) => next();

// Global Rate Limiting for general API endpoints
export const globalLimiter = ENABLE_RATE_LIMIT
    ? rateLimit({
        windowMs: RATE_LIMIT_WINDOW_MS,
        max: RATE_LIMIT_GLOBAL_MAX,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 429,
            message: "Too many requests from this IP, please try again after 15 minutes.",
        },
    })
    : passThrough;

// Strict Rate Limiting for sensitive endpoints (Auth, Messages, Forms, Subscribers)
export const strictLimiter = ENABLE_RATE_LIMIT
    ? rateLimit({
        windowMs: RATE_LIMIT_WINDOW_MS,
        max: RATE_LIMIT_STRICT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 429,
            message: "Too many attempts from this IP, please try again after 15 minutes.",
        },
    })
    : passThrough;

