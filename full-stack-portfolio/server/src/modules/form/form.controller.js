import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { FormService } from "./form.service.js";

const getForms = asyncHandler(async (req, res) => {
    const { isActive } = req.query;
    const forms = await FormService.getForms(isActive);

    return res
        .status(200)
        .json(new ApiResponse(200, forms, "Forms fetched successfully"));
});

const getForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const form = await FormService.getFormById(id);

    return res
        .status(200)
        .json(new ApiResponse(200, form, "Form fetched successfully"));
});

const createForm = asyncHandler(async (req, res) => {
    const { title, description, questions, isActive, expiryDate } = req.body;

    if (!title) throw new ApiError(400, "Title is required");

    const form = await FormService.createForm({ title, description, questions, isActive, expiryDate });

    return res
        .status(201)
        .json(new ApiResponse(201, form, "Form created successfully"));
});

const updateForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const form = await FormService.updateForm(id, req.body);

    return res
        .status(200)
        .json(new ApiResponse(200, form, "Form updated successfully"));
});

const deleteForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await FormService.deleteForm(id);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Form deleted successfully"));
});

export { getForms, getForm, createForm, updateForm, deleteForm };
