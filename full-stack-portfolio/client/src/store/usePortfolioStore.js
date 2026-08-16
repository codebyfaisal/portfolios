import { create } from 'zustand';
import portfolioService from '../api/portfolio.service';

const usePortfolioStore = create((set) => ({
    data: null,
    loading: true,
    error: null,
    isRounded: false,
    rounded: "",
    config: {},
    user: {},
    plans: [],
    serverError: false,
    mobileMenuOpen: false,
    setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

    setServerError: (status) => set({ serverError: status }),

    fetchData: async () => {
        set({ loading: true, error: null });
        try {
            const data = await portfolioService.getPortfolioData();
            set({
                data,
                loading: false,
                isRounded: data?.config?.appearance?.theme?.borderRadius || false,
                rounded: data?.config?.appearance?.theme?.borderRadius ? "rounded-3xl" : "",
                config: data?.config,
                user: data?.user,
                plans: data?.plans
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchHomeData: async () => {
        set({ loading: true, error: null });
        try {
            const data = await portfolioService.getHomeData();
            set({
                data: {
                    user: data.user,
                    services: data.featuredService || [],
                    projects: data.featuredProjects || [],
                    testimonials: data.testimonials || [],
                },
                loading: false,
                isRounded: data?.config?.appearance?.theme?.borderRadius || false,
                rounded: data?.config?.appearance?.theme?.borderRadius ? "rounded-3xl" : "",
                config: data?.config,
                user: data?.user,
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));

export default usePortfolioStore;
