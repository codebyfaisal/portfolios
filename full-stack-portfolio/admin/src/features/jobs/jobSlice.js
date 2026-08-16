import jobsService from './jobs.service';

export const createJobSlice = (set) => ({
    jobs: [],
    job: null,
    applications: [],
    application: null,
    isApplicationsLoading: true,

    fetchJobs: async (status = "") => {
        set({ isLoading: true, error: null });
        try {
            const params = status ? { status } : {};
            const data = await jobsService.getJobs(params);
            set({ jobs: data });
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to fetch jobs" });
        } finally {
            set({ isLoading: false });
        }
    },

    addJob: async (jobData) => {
        set({ isLoading: true, error: null });
        try {
            const data = await jobsService.createJob(jobData);
            set((state) => ({ jobs: [data, ...state.jobs] }));
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to add job" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateJob: async (id, jobData) => {
        set({ isLoading: true, error: null });
        try {
            const data = await jobsService.updateJob(id, jobData);
            set((state) => ({
                jobs: state.jobs.map((j) => (j._id === id ? data : j)),
                job: state.job?._id === id ? data : state.job
            }));
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to update job" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteJob: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await jobsService.deleteJob(id);
            set((state) => ({
                jobs: state.jobs.filter((j) => j._id !== id),
                job: state.job?._id === id ? null : state.job
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to delete job" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    fetchApplications: async (filters = {}) => {
        set({ isApplicationsLoading: true, error: null });
        try {
            const data = await jobsService.getApplications(filters);
            set({ applications: data });
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to fetch applications" });
        } finally {
            set({ isApplicationsLoading: false });
        }
    },

    updateApplicationStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
            const data = await jobsService.updateApplication(id, { status });
            set((state) => ({
                applications: state.applications.map((app) =>
                    app._id === id ? data : app
                ),
            }));
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to update application status" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteApplication: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await jobsService.deleteApplication(id);
            set((state) => ({
                applications: state.applications.filter((a) => a._id !== id),
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to delete application" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    resetJobsState: () => {
        set({ jobs: [], isLoading: true });
    },

    resetApplicationsState: () => {
        set({ isApplicationsLoading: true, applications: [] });
    },
});
