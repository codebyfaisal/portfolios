import projectsService from './projects.service';
import { getErrorMessage } from "@/store/utils";

export const createProjectSlice = (set, get) => ({
    projects: null,
    projectPromise: null,

    fetchProjects: async () => {
        const { projects, projectPromise } = get();

        if (projects !== null) {
            if (projectPromise) return projectPromise;
            const resolved = Promise.resolve(projects);
            set({ projectPromise: resolved });
            return resolved;
        }

        if (projectPromise) return projectPromise;

        set({ isLoading: true });
        try {
            const promise = projectsService.getProjects().then((data) => {
                const safeData = data || [];
                set({
                    projects: safeData,
                    projectPromise: Promise.resolve(safeData),
                    isLoading: false
                });
                return safeData;
            });

            set({ projectPromise: promise });
            return promise;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    addProject: async (projectData) => {
        set({ isLoading: true });
        try {
            const newProject = await projectsService.createProject(projectData);
            set((state) => {
                const newProjects = [...(state.projects || []), newProject];
                return {
                    projects: newProjects,
                    projectPromise: Promise.resolve(newProjects),
                    isLoading: false
                };
            });
            return newProject;
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },

    updateProject: async (id, projectData) => {
        set({ isLoading: true });
        try {
            const updatedProject = await projectsService.updateProject(id, projectData);
            set((state) => {
                const newProjects = state.projects.map(p => p._id === id ? updatedProject : p);
                return {
                    projects: newProjects,
                    projectPromise: Promise.resolve(newProjects),
                    isLoading: false
                };
            });
            return updatedProject;
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },

    deleteProject: async (id) => {
        set({ isLoading: true });
        try {
            await projectsService.deleteProject(id);
            set((state) => {
                const newProjects = state.projects.filter(p => p._id !== id);
                return {
                    projects: newProjects,
                    projectPromise: Promise.resolve(newProjects),
                    isLoading: false
                };
            });
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },
    resetProjectState: () => {
        set({ projects: null, isLoading: true, projectPromise: null });
    },
});
