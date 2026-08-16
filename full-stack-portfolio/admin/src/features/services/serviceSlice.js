import servicesService from './services.service';
import { getErrorMessage } from "@/store/utils";

export const createServiceSlice = (set, get) => ({
    services: null,
    servicePromise: null,

    fetchServices: async () => {
        const { services, servicePromise } = get();

        if (services !== null) {
            if (servicePromise) return servicePromise;
            const resolved = Promise.resolve(services);
            set({ servicePromise: resolved });
            return resolved;
        }

        if (servicePromise) return servicePromise;

        set({ isLoading: true });

        try {
            const promise = servicesService.getServices().then((data) => {
                const safeData = data || [];
                set({
                    services: safeData,
                    servicePromise: Promise.resolve(safeData),
                    isLoading: false
                });
                return safeData;
            });

            set({ servicePromise: promise });
            return promise;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    addService: async (serviceData) => {
        try {
            const newService = await servicesService.createService(serviceData);
            set((state) => {
                const newServices = [...(state.services || [])].map(s => {
                    if (newService.isFeatured && s.isFeatured) {
                        return { ...s, isFeatured: false };
                    }
                    return s;
                });
                newServices.push(newService);
                return {
                    services: newServices,
                    servicePromise: Promise.resolve(newServices),
                };
            });
            return newService;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    updateService: async (id, serviceData) => {
        try {
            const updatedService = await servicesService.updateService(id, serviceData);
            set((state) => {
                const newServices = state.services.map(s => {
                    if (s._id === id) return updatedService;
                    if (updatedService.isFeatured && s.isFeatured) {
                        return { ...s, isFeatured: false };
                    }
                    return s;
                });
                return {
                    services: newServices,
                    servicePromise: Promise.resolve(newServices),
                };
            });
            return updatedService;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    deleteService: async (id) => {
        try {
            await servicesService.deleteService(id);
            set((state) => {
                const newServices = state.services.filter(s => s._id !== id);
                return {
                    services: newServices,
                    servicePromise: Promise.resolve(newServices),
                };
            });
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
    resetServiceState: () => {
        set({ services: null, isLoading: true, servicePromise: null });
    },
});
