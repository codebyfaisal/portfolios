import { Visit } from "./visit.model.js";
import { SystemSetting } from "./setting.model.js";
import { ApiError } from "../../utils/ApiError.js";
import geoip from "geoip-lite";

const recordVisit = async (ip, userAgent) => {
    const geo = geoip.lookup(ip);

    // Check if visit exists for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingVisit = await Visit.findOne({
        ip,
        userAgent,
        timestamp: { $gte: startOfDay }
    });

    if (!existingVisit) {
        await Visit.create({
            ip,
            userAgent,
            country: geo?.country,
            city: geo?.city,
            browser: userAgent,
            platform: "Unknown" // Ideally parse this
        });
        return { recorded: true };
    }
    return { recorded: false };
};

const getVisitStats = async () => {
    const totalVisits = await Visit.countDocuments();
    const uniqueVisitors = await Visit.distinct('ip');

    // Get visits by country
    const visitsByCountry = await Visit.aggregate([
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    return {
        totalVisits,
        uniqueVisitors: uniqueVisitors.length,
        items: visitsByCountry
    };
};

// System Settings logic
const getSystemSettings = async () => {
    let settings = await SystemSetting.findOne();
    if (!settings) settings = await SystemSetting.create({});
    return settings;
};

const updateSystemSettings = async (data) => {
    let settings = await SystemSetting.findOne();
    if (!settings) {
        settings = await SystemSetting.create(data);
    } else {
        if (data.maintenanceMode !== undefined) settings.maintenanceMode = data.maintenanceMode;
        if (data.allowRegistration !== undefined) settings.allowRegistration = data.allowRegistration;
        if (data.notificationEmail) settings.notificationEmail = data.notificationEmail;
        await settings.save();
    }
    return settings;
};

export const VisitService = {
    recordVisit,
    getVisitStats,
    getSystemSettings,
    updateSystemSettings
};
