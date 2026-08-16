import geoip from "geoip-lite";

export const getIpLocation = (ip) => {
    if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
        return "Localhost / Internal Network";
    }
    try {
        const cleanIp = ip.replace(/^::ffff:/, "");
        const geo = geoip.lookup(cleanIp);
        if (!geo) return "Unknown Location";
        const parts = [geo.city, geo.region, geo.country].filter(Boolean);
        return parts.join(", ") || "Unknown Location";
    } catch (err) {
        return "Unknown Location";
    }
};
