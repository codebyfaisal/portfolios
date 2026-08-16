import { Application } from "./application.model.js";
import { Applicant } from "./applicant.model.js";
import { Job } from "./job.model.js";
import { ApiError } from "../../utils/ApiError.js";

const createApplication = async (jobId, data) => {
    const job = await Job.findOne({ _id: jobId, status: "open" });
    if (!job) throw new ApiError(404, "Job not found or not accepting applications");

    // Check if applicant exists or create new
    let applicant = await Applicant.findOne({ email: data.email });
    if (!applicant) {
        applicant = await Applicant.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
            resume: data.resume,
            portfolio: data.portfolio,
            linkedin: data.linkedin
        });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
        job: jobId,
        applicant: applicant._id
    });

    if (existingApplication) {
        throw new ApiError(409, "You have already applied for this position");
    }

    const application = await Application.create({
        job: jobId,
        applicant: applicant._id,
        answers: data.answers || [],
        coverLetter: data.coverLetter,
        status: "new"
    });

    // Add application to job
    await Job.findByIdAndUpdate(jobId, {
        $push: { applicants: application._id }
    });

    return application;
};

const getApplications = async (jobId, status) => {
    const filter = {};
    if (jobId) filter.job = jobId;
    if (status) filter.status = status;

    return await Application.find(filter)
        .populate("job", "title location type")
        .populate("applicant")
        .sort({ createdAt: -1 });
};

const getApplicationById = async (id) => {
    const application = await Application.findById(id)
        .populate("job", "title location type")
        .populate("applicant");

    if (!application) throw new ApiError(404, "Application not found");
    return application;
};

const updateApplicationStatus = async (id, status, notes) => {
    const updateData = { status };
    if (notes) updateData.notes = notes;

    const application = await Application.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
    ).populate("job applicant");

    if (!application) throw new ApiError(404, "Application not found");
    return application;
};

const deleteApplication = async (id) => {
    const application = await Application.findById(id);
    if (!application) throw new ApiError(404, "Application not found");

    // Remove reference from Job
    await Job.findByIdAndUpdate(application.job, {
        $pull: { applicants: application._id }
    });

    await Application.findByIdAndDelete(id);
    return application;
};

const countApplications = async () => {
    return await Application.countDocuments();
};

const getApplicationsByEmail = async (email) => {
    const applicant = await Applicant.findOne({ email });
    if (!applicant) return [];

    return await Application.find({ applicant: applicant._id })
        .sort({ createdAt: -1 })
        .select("status createdAt job form")
        .populate("job", "title")
        .populate("form", "title");
};

export const ApplicationService = {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication,
    countApplications,
    getApplicationsByEmail
};
