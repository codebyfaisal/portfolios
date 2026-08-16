import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ServiceService } from "./service.service.js";

const createService = asyncHandler(async (req, res) => {
    const { title, description, icon, features, plans, whyChooseMe, techStack, process, faq, cta, isFeatured } = req.body;

    const service = await ServiceService.createService({
        title,
        description,
        icon,
        features,
        plans,
        whyChooseMe,
        techStack,
        process,
        faq,
        cta,
        isFeatured
    });

    return res.status(201).json(
        new ApiResponse(201, service, "Service created successfully")
    );
});

const getAllServices = asyncHandler(async (req, res) => {
    const services = await ServiceService.getAllServices();
    return res.status(200).json(
        new ApiResponse(200, services, "Services fetched successfully")
    );
});

const getServiceById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = await ServiceService.getServiceById(id);

    return res.status(200).json(
        new ApiResponse(200, service, "Service fetched successfully")
    );
});

const updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, icon, features, plans, whyChooseMe, techStack, process, faq, cta, isFeatured } = req.body;

    const service = await ServiceService.updateService(id, {
        title,
        description,
        icon,
        features,
        plans,
        whyChooseMe,
        techStack,
        process,
        faq,
        cta,
        isFeatured
    });

    return res.status(200).json(
        new ApiResponse(200, service, "Service updated successfully")
    );
});

const deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await ServiceService.deleteService(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Service deleted successfully")
    );
});

export {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};
