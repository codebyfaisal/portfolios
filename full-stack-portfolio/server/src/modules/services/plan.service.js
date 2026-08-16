import { Plan } from "./plan.model.js";
import { ApiError } from "../../utils/ApiError.js";

const createPlan = async (data) => {
    return await Plan.create(data);
};

const getAllPlans = async () => {
    return await Plan.find();
};

const getPlanById = async (id) => {
    const plan = await Plan.findById(id);
    if (!plan) throw new ApiError(404, "Plan not found");
    return plan;
};

const updatePlan = async (id, data) => {
    const plan = await Plan.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
    );
    if (!plan) throw new ApiError(404, "Plan not found");
    return plan;
};

const deletePlan = async (id) => {
    const plan = await Plan.findByIdAndDelete(id);
    if (!plan) throw new ApiError(404, "Plan not found");
    return plan;
};

const countPlans = async () => {
    return await Plan.countDocuments();
};

export const PlanService = {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan,
    countPlans
};
