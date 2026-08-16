import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { PlanService } from "./plan.service.js";

const createPlan = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        deliveryTime,
        revisions,
        features,
        addOns,
        popular,
        isCustom
    } = req.body;

    const plan = await PlanService.createPlan({
        name,
        price,
        deliveryTime,
        revisions,
        features,
        addOns,
        popular,
        isCustom
    });

    return res.status(201).json(
        new ApiResponse(201, plan, "Plan created successfully")
    );
});

const getAllPlans = asyncHandler(async (req, res) => {
    const plans = await PlanService.getAllPlans();
    return res.status(200).json(
        new ApiResponse(200, plans, "Plans fetched successfully")
    );
});

const getPlanById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const plan = await PlanService.getPlanById(id);

    return res.status(200).json(
        new ApiResponse(200, plan, "Plan fetched successfully")
    );
});

const updatePlan = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        name,
        price,
        deliveryTime,
        revisions,
        features,
        addOns,
        popular,
        isCustom
    } = req.body;

    const plan = await PlanService.updatePlan(id, {
        name,
        price,
        deliveryTime,
        revisions,
        features,
        addOns,
        popular,
        isCustom
    });

    return res.status(200).json(
        new ApiResponse(200, plan, "Plan updated successfully")
    );
});

const deletePlan = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await PlanService.deletePlan(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Plan deleted successfully")
    );
});

export {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan
};
