import { Visit } from "./visit.model.js";
import { SystemSetting } from "./setting.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { VisitService } from "./visit.service.js";
import geoip from "geoip-lite";

const logVisit = asyncHandler(async (req, res) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress || req.ip;
    const { page, userAgent: bodyUserAgent } = req.body;
    const userAgent = bodyUserAgent || req.headers["user-agent"];

    // 1. Check Global Cleanup Config
    const cleanupSetting = await SystemSetting.findOne({ key: "lastLogCleanup" });
    const lastCleanup = cleanupSetting?.value ? new Date(cleanupSetting.value) : null;
    const lastVisitCookie = req.cookies?._unique_visit_session;
    const today = new Date().toISOString().split("T")[0];

    // Cookie Validation
    if (lastVisitCookie) {
        const cookieDate = new Date(lastVisitCookie);
        if (!isNaN(cookieDate.getTime())) {
            if (lastCleanup && cookieDate < lastCleanup) {
             } else {
                const cookieDay = cookieDate.toISOString().split("T")[0];
                if (cookieDay === today) {
                    return res.status(200).json(new ApiResponse(200, {}, "Visit already logged today"));
                }
            }
        }
    }

    // Call Service to record
    await VisitService.recordVisit(ip, userAgent);

    // Set Cookie
    const now = new Date();
    res.cookie("_unique_visit_session", now.toISOString(), {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    return res.status(200).json(new ApiResponse(200, {}, "Visit recorded"));
});

const getVisitStats = asyncHandler(async (req, res) => {
    const stats = await VisitService.getVisitStats();
    return res.status(200).json(
        new ApiResponse(200, stats, "Visit stats fetched successfully")
    );
});

const getSystemSettings = asyncHandler(async (req, res) => {
    const settings = await VisitService.getSystemSettings();
    return res.status(200).json(
        new ApiResponse(200, settings, "System settings fetched")
    );
});

const updateSystemSettings = asyncHandler(async (req, res) => {
    const settings = await VisitService.updateSystemSettings(req.body);
    return res.status(200).json(
        new ApiResponse(200, settings, "System settings updated")
    );
});

const getAllVisits = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, startDate, endDate, ip, country, city, region, path, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
        query.$or = [
            { ip: { $regex: search, $options: "i" } },
            { page: { $regex: search, $options: "i" } },
            { "location.country": { $regex: search, $options: "i" } }
        ];
    }

    if (ip) query.ip = { $regex: ip, $options: "i" };
    if (country) query["location.country"] = { $regex: country, $options: "i" };
    if (city) query["location.city"] = { $regex: city, $options: "i" };
    if (region) query["location.region"] = { $regex: region, $options: "i" };
    if (path) query.page = { $regex: path, $options: "i" };

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query.createdAt.$lte = end;
        }
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const visits = await Visit.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Visit.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            visits,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        }, "Visits fetched successfully")
    );
});

const deleteVisits = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "No visit IDs provided");
    }
    const result = await Visit.deleteMany({ _id: { $in: ids } });
    return res.status(200).json(
        new ApiResponse(200, { deletedCount: result.deletedCount }, `Successfully deleted ${result.deletedCount} visits`)
    );
});

const getVisitConfig = asyncHandler(async (req, res) => {
    const setting = await SystemSetting.findOne({ key: "lastLogCleanup" });
    return res.status(200).json(
        new ApiResponse(200, { lastLogCleanup: setting?.value || null }, "Config fetched")
    );
});

const cleanupVisits = asyncHandler(async (req, res) => {
    const result = await Visit.deleteMany({});
    await SystemSetting.findOneAndUpdate(
        { key: "lastLogCleanup" },
        { value: new Date().toISOString() },
        { upsert: true, new: true }
    );
    return res.status(200).json(
        new ApiResponse(200, { deletedCount: result.deletedCount }, `System Wiped. ${result.deletedCount} visits deleted.`)
    );
});

export { logVisit, getVisitStats, getAllVisits, deleteVisits, getVisitConfig, cleanupVisits, getSystemSettings, updateSystemSettings };
