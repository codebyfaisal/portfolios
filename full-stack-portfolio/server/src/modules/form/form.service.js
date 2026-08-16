import { Form } from "./form.model.js";
import { Job } from "../job/job.model.js";
import { ApiError } from "../../utils/ApiError.js";

const setEndOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

const getForms = async (isActive) => {
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === "true";
    return await Form.find(filter).sort({ createdAt: -1 });
};

const getFormById = async (id) => {
    const form = await Form.findById(id);
    if (!form) throw new ApiError(404, "Form not found");
    return form;
};

const createForm = async (data) => {
    const { title, description, questions, isActive, expiryDate, job } = data;
    const formattedExpiryDate = expiryDate ? setEndOfDay(expiryDate) : undefined;

    return await Form.create({
        title,
        description,
        questions: questions || [],
        isActive: isActive !== undefined ? isActive : true,
        expiryDate: formattedExpiryDate,
        job
    });
};

const updateForm = async (id, data) => {
    if (data.expiryDate) {
        data.expiryDate = setEndOfDay(data.expiryDate);
    }

    const form = await Form.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!form) throw new ApiError(404, "Form not found");

    if (data.expiryDate && form.job) {
        await Job.findByIdAndUpdate(
            form.job,
            { $set: { lastDate: data.expiryDate } }
        );
    }

    return form;
};

const deleteForm = async (id) => {
    const form = await Form.findByIdAndDelete(id);
    if (!form) throw new ApiError(404, "Form not found");
    return form;
};

export const FormService = {
    getForms,
    getFormById,
    createForm,
    updateForm,
    deleteForm
};
