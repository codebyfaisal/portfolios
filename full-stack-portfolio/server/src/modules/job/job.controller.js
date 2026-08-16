import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { JobService } from "./job.service.js";

const getJobs = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const jobs = await JobService.getJobs(status);

    return res.status(200).json(
        new ApiResponse(200, jobs, "Jobs fetched successfully")
    );
});

const getJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const job = await JobService.getJobById(id);

    return res.status(200).json(
        new ApiResponse(200, job, "Job fetched successfully")
    );
});

const createJob = asyncHandler(async (req, res) => {
    const { title, type, location, salary, description, requirements, responsibilities, skills, status, form } = req.body;

    if (!title) throw new ApiError(400, "Title is required");

    const job = await JobService.createJob({
        title,
        type,
        location,
        salary,
        description,
        requirements,
        responsibilities,
        skills,
        status,
        form
    });

    return res.status(201).json(
        new ApiResponse(201, job, "Job created successfully")
    );
});

const updateJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const job = await JobService.updateJob(id, req.body);

    return res.status(200).json(
        new ApiResponse(200, job, "Job updated successfully")
    );
});

const deleteJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await JobService.deleteJob(id);

    return res.status(200).json(
        new ApiResponse(200, null, "Job deleted successfully")
    );
});

const getPublicJobs = asyncHandler(async (req, res) => {
    const jobs = await JobService.getPublicJobs();

    return res.status(200).json(
        new ApiResponse(200, jobs, "Jobs fetched successfully")
    );
});

const getPublicJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const job = await JobService.getPublicJobById(id);

    return res.status(200).json(
        new ApiResponse(200, job, "Job fetched successfully")
    );
});

export { getJobs, getJob, createJob, updateJob, deleteJob, getPublicJobs, getPublicJob };
