import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { UserService } from "./user.service.js";
import { ConfigService } from "./config.service.js";
import { AuthService } from "../auth/auth.service.js";
import { Project } from "../projects/project.model.js";
import { Service } from "../services/service.model.js";
import { Testimonial } from "../testimonials/testimonial.model.js";

const getUser = asyncHandler(async (req, res) => {
    const user = await UserService.getUserProfile(req.user._id);
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
    const {
        username,
        name,
        email,
        bio,
        phone,
        address,
        socialLinks,
        skills,
        experience,
        education,
        projectsCompleted,
        happyClients,
        yearOfExperience,
        avatar,
        resume,
        introVideo
    } = req.body;

    if (!username) throw new ApiError(400, "Username is required");
    if (!name?.first) throw new ApiError(400, "First name is required");
    if (!email) throw new ApiError(400, "Email is required");

    const updateData = {
        username,
        name,
        email,
        bio,
        phone,
        address,
        socialLinks,
        skills,
        experience,
        education,
        stats: {
            yearOfExperience,
            projectsCompleted,
            happyClients
        },
        avatar,
        resume,
        introVideo
    };

    const user = await UserService.updateUserProfile(req.user, updateData);

    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

const getPortfolioProfile = asyncHandler(async (req, res) => {
    const user = await UserService.getPortfolioUser();
    const config = await ConfigService.getConfig();

    if (!user) throw new ApiError(404, "User profile not found");

    return res.status(200).json(
        new ApiResponse(200, { user, config }, "Portfolio profile fetched successfully")
    );
});

const getHomeData = asyncHandler(async (req, res) => {
    const user = await UserService.getPortfolioUser();
    const config = await ConfigService.getConfig() || {};

    if (!user) throw new ApiError(404, "User profile not found");

    const mappedUser = {
        name: user.name,
        role: config.hero?.subTitle || user.role || "Developer",
        aboutImage: config.about?.image || user.aboutImage,
        avatar: config.hero?.image || user.avatar,
        appearance: config.appearance || { rounded: true },
        socialLinks: user.socialLinks || {},
        resume: user.resume,
        introVideo: user.introVideo,
        skills: user.skills || [],
        stats: user.stats || {},
        experience: user.experience || [],
        education: user.education || [],
        bio: user.bio || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
    };

    // Fetch featured resources
    const featuredService = await Service.findOne({ isFeatured: true });
    
    // Fallback: If no featured projects exist, just get the latest 2
    let featuredProjects = await Project.find({ featured: true })
        .select("title images description")
        .limit(2);
        
    if (featuredProjects.length === 0) {
        featuredProjects = await Project.find()
            .sort({ createdAt: -1 })
            .select("title images description")
            .limit(2);
    }

    const testimonials = await Testimonial.find();

    const homeData = {
        user: mappedUser,
        featuredService: featuredService ? [featuredService] : [],
        featuredProjects,
        testimonials,
        config,
    };

    return res.status(200).json(
        new ApiResponse(200, homeData, "Home data fetched successfully")
    );
});

export { getUser, updateUser, getPortfolioProfile, getHomeData };

