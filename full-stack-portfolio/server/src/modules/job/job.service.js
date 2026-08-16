import { Job } from "./job.model.js";
import { Form } from "../form/form.model.js";
import { ApiError } from "../../utils/ApiError.js";

const setEndOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

const createJob = async (data) => {
    if (data.lastDate) data.lastDate = setEndOfDay(data.lastDate);

    return await Job.create(data);
};

const getJobs = async (status) => {
    const filter = {};
    if (status) filter.status = status;
    return await Job.find(filter).sort({ createdAt: -1 });
};

const getJobById = async (id) => {
    const job = await Job.findById(id);
    if (!job) throw new ApiError(404, "Job not found");
    return job;
};

const updateJob = async (id, data) => {
    if (data.lastDate) data.lastDate = setEndOfDay(data.lastDate);

    const job = await Job.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    );
    if (!job) throw new ApiError(404, "Job not found");

    if (data.lastDate) await Form.findOneAndUpdate(
        { job: id },
        { $set: { expiryDate: data.lastDate } }
    );

    return job;
};

const deleteJob = async (id) => {
    const job = await Job.findByIdAndDelete(id);
    if (!job) throw new ApiError(404, "Job not found");
    return job;
};

const getPublicJobs = async () => {
    return await Job.find({ status: "open" })
        .select("-applicants -salary -notes")
        .sort({ createdAt: -1 });
};

const getPublicJobById = async (id) => {
    const job = await Job.findOne({ _id: id, status: "open" })
        .select("-applicants -salary -notes");
    if (!job) throw new ApiError(404, "Job not found or closed");
    return job;
};

const countJobs = async () => {
    return await Job.countDocuments();
};

export const JobService = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getPublicJobs,
    getPublicJobById,
    countJobs
};
