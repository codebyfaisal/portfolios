import api from "./axios";

const portfolioService = {
    getPortfolioData: async () => {
        try {
            const [userRes, servicesRes, projectsRes, testimonialsRes, plansRes] =
                await Promise.all([
                    api.get("/users/portfolio"),
                    api.get("/services"),
                    api.get("/projects"),
                    api.get("/testimonials"),
                    api.get("/services/plans"),
                ]);

            const userData = userRes.data.data.user;
            const configData = userRes.data.data.config || {};

            const mappedUser = {
                ...userData,
                role: configData.hero?.subTitle || userData.role || "Developer",
                aboutImage: configData.about?.image || userData.aboutImage,
                avatar: configData.hero?.image || userData.avatar,
                appearance: configData.appearance || { rounded: true },
                socialLinks: userData.socialLinks || {},
                resume: userData.resume,
                introVideo: userData.introVideo,
            };

            return {
                user: mappedUser,
                services: servicesRes.data.data,
                projects: projectsRes.data.data,
                testimonials: testimonialsRes.data.data,
                plans: plansRes.data.data,
                config: configData,
            };
        } catch (error) {
            console.error("Error fetching portfolio data:", error);
            return null;
        }
    },

    getHomeData: async () => {
        try {
            const response = await api.get("/users/portfolio/home");
            return response.data.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    },

    sendMessage: async (messageData) => {
        const response = await api.post("/messages", messageData);
        return response.data;
    }
};

export default portfolioService;
