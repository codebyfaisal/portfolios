import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ConfigService } from "./config.service.js";

const updateConfig = asyncHandler(async (req, res) => {
    const { hero, about, messageTypes, appearance, footer, navigation, maintenance } = req.body;
    const config = await ConfigService.updateConfig({ hero, about, messageTypes, appearance, footer, navigation, maintenance });

    return res.status(200).json(
        new ApiResponse(200, config, "Config updated successfully")
    );
});

const getConfig = asyncHandler(async (req, res) => {
    const config = await ConfigService.getConfig();
    return res.status(200).json(
        new ApiResponse(200, config, "Config fetched successfully")
    );
});

export {
    updateConfig,
    getConfig
};
