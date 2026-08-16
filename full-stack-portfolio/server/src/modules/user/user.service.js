import { User } from "./user.model.js";
import { Project } from "../projects/project.model.js";
import { Service } from "../services/service.model.js";
import { Testimonial } from "../testimonials/testimonial.model.js";
import { ApiError } from "../../utils/ApiError.js";

const ensureSingleUser = async () => {
    const users = await User.find();
    if (users.length > 1) {
        const primaryUser = users.find(u => u.bio || (u.email && u.email !== "admin@example.com")) || users[0];
        await User.deleteMany({ _id: { $ne: primaryUser._id } });
        return primaryUser;
    } else if (users.length === 1) {
        return users[0];
    } else {
        const defaultUser = await User.create({
            username: "admin",
            email: "admin@example.com",
            name: { first: "Admin", last: "User" }
        });
        return defaultUser;
    }
};

const getUserProfile = async () => {
    const user = await ensureSingleUser();
    return user;
};

const updateUserProfile = async (currentUser, updateData) => {
    // Delete older user documents completely
    await User.deleteMany({});

    // Recreate fresh single user document with updated data
    const user = await User.create(updateData);

    return user;
};

const getCompassStats = async () => {
    const projectCount = await Project.countDocuments();
    const serviceCount = await Service.countDocuments();
    const testimonialCount = await Testimonial.countDocuments();

    return {
        projectCount,
        serviceCount,
        testimonialCount
    };
};

const getPortfolioUser = async () => {
    const user = await ensureSingleUser();
    return user;
};

export const UserService = {
    getUserProfile,
    updateUserProfile,
    getCompassStats,
    getPortfolioUser
};
