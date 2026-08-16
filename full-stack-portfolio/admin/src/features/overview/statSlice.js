import visitorsService from "@/features/visitors/visitors.service";
import { getErrorMessage } from "@/store/utils";

export const createStatSlice = (set, get) => ({
    overview: null,
    overviewPromise: null,
    visitorStats: null,
    visitorStatsPromise: null,
    visits: null,
    isLoadingOverview: true,
    isLoadingVisitorStats: true,
    isLoadingVisits: true,
    statsError: null,

    fetchOverviewStats: async () => {
        const { overviewPromise } = get();
        if (overviewPromise) return overviewPromise;

        set({ isLoadingOverview: true });

        const promise = visitorsService.getOverviewStats().then((stats) => {
            set({ overview: stats, overviewPromise: null, isLoadingOverview: false });
            return stats;
        }).catch((error) => {
            set({ isLoadingOverview: false });
            throw error;
        });

        set({ overviewPromise: promise });
        return promise;
    },

    fetchVisitorStats: async () => {
        const { visitorStatsPromise } = get();
        if (visitorStatsPromise) return visitorStatsPromise;

        set({ isLoadingVisitorStats: true });

        const promise = visitorsService.getVisitorStats().then((stats) => {
            set({ visitorStats: stats, visitorStatsPromise: null, isLoadingVisitorStats: false });
            return stats;
        }).catch((error) => {
            set({ isLoadingVisitorStats: false });
            throw error;
        });

        set({ visitorStatsPromise: promise });
        return promise;
    },

    fetchVisits: async (params) => {
        set({ isLoadingVisits: true, statsError: null });
        try {
            const data = await visitorsService.getVisits(params);
            set({ visits: data, isLoadingVisits: false });
            return data;
        } catch (error) {
            console.error("Fetch visits failed", error);
            set({ statsError: getErrorMessage(error), isLoadingVisits: false });
        }
    },

    deleteVisits: async (ids) => {
        set({ isLoadingVisits: true });
        try {
            await visitorsService.deleteVisits(ids);

            const { visits } = get();
            if (visits && visits.visits) {
                const newVisits = visits.visits.filter(v => !ids.includes(v._id));
                set({
                    visits: {
                        ...visits,
                        visits: newVisits,
                        meta: {
                            ...visits.meta,
                            total: Math.max(0, visits.meta.total - ids.length)
                        }
                    },
                    isLoadingVisits: false
                });
            } else {
                set({ isLoadingVisits: false });
            }

            get().fetchVisitorStats();
        } catch (error) {
            set({ statsError: getErrorMessage(error), isLoadingVisits: false });
            throw error;
        }
    },

    wipeAllVisits: async () => {
        set({ isLoadingVisits: true });
        try {
            await visitorsService.cleanupVisits();

            const { visits } = get();
            if (visits) {
                set({
                    visits: {
                        ...visits,
                        visits: [],
                        meta: { ...visits.meta, total: 0 }
                    },
                    isLoadingVisits: false
                });
            } else {
                set({ isLoadingVisits: false });
            }

            get().fetchVisitorStats();
        } catch (error) {
            set({ statsError: getErrorMessage(error), isLoadingVisits: false });
            throw error;
        }
    },
    resetStatsState: () => {
        set({
            overview: null,
            overviewPromise: null,
            visitorStats: null,
            visitorStatsPromise: null,
            visits: null,
            isLoadingOverview: true,
            isLoadingVisitorStats: true,
            isLoadingVisits: true,
            statsError: null
        });
    },
});
