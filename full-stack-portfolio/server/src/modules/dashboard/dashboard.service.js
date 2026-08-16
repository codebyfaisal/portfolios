import { ProjectService } from "../projects/project.service.js";
import { ServiceService } from "../services/service.service.js";
import { TestimonialService } from "../testimonials/testimonial.service.js";
import { MessageService } from "../messages/message.service.js";
import { PlanService } from "../services/plan.service.js";
import { UserService } from "../user/user.service.js";
import { PostService } from "../posts/post.service.js";
import { ConfigService } from "../user/config.service.js";

const getOverviewStats = async (userId) => {
    const [
        projectCount,
        serviceCount,
        testimonialCount,
        messageCount,
        planCount,
        postCount,
        recentMessages,
        user,
        config
    ] = await Promise.all([
        ProjectService.countProjects(),
        ServiceService.countServices(),
        TestimonialService.countTestimonials(),
        MessageService.countMessages(),
        PlanService.countPlans(),
        PostService.countPosts(),
        MessageService.getRecentMessages(5),
        UserService.getUserProfile(userId),
        ConfigService.getConfig()
    ]);

    // Health Check Logic
    // Weights Configuration
    let score = 0;
    const checklist = [];

    // --- 1. User Profile Checks ---
    if (user?.avatar) score += 5;
    else checklist.push("Upload a Profile Picture");

    if (user?.bio && user.bio.length > 20) score += 10;
    else checklist.push("Add a descriptive Bio (20+ chars)");

    if (user?.resume) score += 10;
    else checklist.push("Upload your Resume");

    const socialLinksCount = user?.socialLinks ? Object.values(user.socialLinks).filter(l => !!l).length : 0;
    if (socialLinksCount >= 2) score += 5;
    else checklist.push("Link at least 2 Social Media accounts");


    // --- 2. Content Checks ---
    const projectPoints = Math.min(projectCount, 3) * 5;
    score += projectPoints;
    if (projectCount < 3) checklist.push(`Add ${3 - projectCount} more Project(s)`);

    const servicePoints = Math.min(serviceCount, 2) * 7.5;
    score += servicePoints;
    if (serviceCount < 2) checklist.push(`Add ${2 - serviceCount} more Service(s)`);

    if (planCount >= 1) score += 10;
    else checklist.push("Create at least 1 Pricing Plan");

    // --- Final Status ---
    const health = {
        score: Math.round(score),
        status: "Poor",
        checklist: checklist.slice(0, 5)
    };

    if (score >= 90) health.status = "Perfect";
    else if (score >= 70) health.status = "Good";
    else if (score >= 40) health.status = "Weak";

    return {
        counts: {
            projects: projectCount,
            services: serviceCount,
            testimonials: testimonialCount,
            messages: messageCount,
            plans: planCount,
            posts: postCount
        },
        recentMessages,
        health
    };
};

export const DashboardService = {
    getOverviewStats
};
