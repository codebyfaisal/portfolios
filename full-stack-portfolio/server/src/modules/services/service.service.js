import { Service } from "./service.model.js";
import { ApiError } from "../../utils/ApiError.js";

const createService = async (data) => {
    if (data.isFeatured) {
        await Service.updateMany({}, { $set: { isFeatured: false } });
    }
    return await Service.create(data);
};

const getAllServices = async () => {
    return await Service.find();
};

const getServiceById = async (id) => {
    const service = await Service.findById(id);
    if (!service) throw new ApiError(404, "Service not found");
    return service;
};

const updateService = async (id, data) => {
    if (data.isFeatured) {
        await Service.updateMany({ _id: { $ne: id } }, { $set: { isFeatured: false } });
    }
    const service = await Service.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
    );
    if (!service) throw new ApiError(404, "Service not found");
    return service;
};

const deleteService = async (id) => {
    const service = await Service.findByIdAndDelete(id);
    if (!service) throw new ApiError(404, "Service not found");
    return service;
};

const countServices = async () => {
    return await Service.countDocuments();
};

export const ServiceService = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    countServices
};
