import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { DashboardService } from "./dashboard.service.js";

const getOverviewStats = asyncHandler(async (req, res) => {
    const stats = await DashboardService.getOverviewStats(req.user._id);

    return res.status(200).json(
        new ApiResponse(200, stats, "Overview stats fetched successfully")
    );
});

export { getOverviewStats };

