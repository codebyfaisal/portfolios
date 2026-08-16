import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ProjectService } from "./project.service.js";

const createProject = asyncHandler(async (req, res) => {
    const { title, description, techStack, liveLink, githubLink, featured, features, images, date } = req.body;

    const project = await ProjectService.createProject({
        title,
        description,
        images,
        techStack,
        liveLink,
        githubLink,
        featured,
        features,
        date
    });

    return res.status(201).json(
        new ApiResponse(201, project, "Project created successfully")
    );
});

const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await ProjectService.getAllProjects();
    return res.status(200).json(
        new ApiResponse(200, projects, "Projects fetched successfully")
    );
});

const getPublicProjects = asyncHandler(async (req, res) => {
    const { page = 1, limit = 6 } = req.query;
    const { projects, total } = await ProjectService.getPublicProjects(page, limit);

    return res.status(200).json(
        new ApiResponse(200, { projects, hasMore: page * limit < total }, "Projects fetched successfully")
    );
});

const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await ProjectService.getProjectById(id);

    return res.status(200).json(
        new ApiResponse(200, project, "Project fetched successfully")
    );
});

const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, techStack, liveLink, githubLink, featured, features, images, date } = req.body;

    const updatedProject = await ProjectService.updateProject(id, {
        title,
        description,
        images,
        techStack,
        liveLink,
        githubLink,
        featured,
        features,
        date
    });

    return res.status(200).json(
        new ApiResponse(200, updatedProject, "Project updated successfully")
    );
});

const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await ProjectService.deleteProject(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Project deleted successfully")
    );
});

export {
    createProject,
    getAllProjects,
    getPublicProjects,
    getProjectById,
    updateProject,
    deleteProject
};
