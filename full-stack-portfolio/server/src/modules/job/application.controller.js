import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApplicationService } from "./application.service.js";

const submitApplication = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, resume, portfolio, coverLetter, answers, linkedin } = req.body;
    const { jobId } = req.params;

    if (!firstName || !lastName || !email || !resume) {
        throw new ApiError(400, "All required fields must be provided");
    }

    const application = await ApplicationService.createApplication(jobId, {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        resume,
        portfolio,
        coverLetter,
        answers,
        linkedin
    });

    return res.status(201).json(
        new ApiResponse(201, application, "Application submitted successfully")
    );
});

const getApplications = asyncHandler(async (req, res) => {
    const { jobId, status } = req.query;
    const applications = await ApplicationService.getApplications(jobId, status);

    return res.status(200).json(
        new ApiResponse(200, applications, "Applications fetched successfully")
    );
});

const getApplication = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const application = await ApplicationService.getApplicationById(id);

    return res.status(200).json(
        new ApiResponse(200, application, "Application fetched successfully")
    );
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await ApplicationService.updateApplicationStatus(id, status, notes);

    return res.status(200).json(
        new ApiResponse(200, application, "Application status updated successfully")
    );
});

const deleteApplication = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await ApplicationService.deleteApplication(id);

    return res.status(200).json(
        new ApiResponse(200, null, "Application deleted successfully")
    );
});

const trackApplications = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const applications = await ApplicationService.getApplicationsByEmail(email);

    return res.status(200).json(
        new ApiResponse(200, applications, "Applications fetched successfully")
    );
});

export {
    submitApplication,
    getApplications,
    getApplication,
    updateApplicationStatus,
    deleteApplication,
    trackApplications
};
