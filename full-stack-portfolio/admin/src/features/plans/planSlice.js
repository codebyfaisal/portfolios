import plansService from './plans.service';
import { getErrorMessage } from "@/store/utils";

export const createPlanSlice = (set, get) => ({
    plans: null,
    planPromise: null,

    fetchPlans: async () => {
        const { plans, planPromise } = get();

        if (plans !== null) {
            if (planPromise) return planPromise;
            const resolved = Promise.resolve(plans);
            set({ planPromise: resolved });
            return resolved;
        }

        if (planPromise) return planPromise;

        set({ isLoading: true });
        try {
            const promise = plansService.getPlans().then((data) => {
                const safeData = data || [];
                set({
                    plans: safeData,
                    planPromise: Promise.resolve(safeData),
                    isLoading: false
                });
                return safeData;
            });

            set({ planPromise: promise });
            return promise;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    addPlan: async (planData) => {
        set({ isLoading: true });
        try {
            const newPlan = await plansService.createPlan(planData);
            set((state) => {
                const newPlans = [...(state.plans || []), newPlan];
                return {
                    plans: newPlans,
                    planPromise: Promise.resolve(newPlans),
                    isLoading: false
                };
            });
            return newPlan;
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },

    updatePlan: async (id, planData) => {
        set({ isLoading: true });
        try {
            const updatedPlan = await plansService.updatePlan(id, planData);
            set((state) => {
                const newPlans = state.plans.map(p => p._id === id ? updatedPlan : p);
                return {
                    plans: newPlans,
                    planPromise: Promise.resolve(newPlans),
                    isLoading: false
                };
            });
            return updatedPlan;
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },

    deletePlan: async (id) => {
        set({ isLoading: true });
        try {
            await plansService.deletePlan(id);
            set((state) => {
                const newPlans = state.plans.filter(p => p._id !== id);
                return {
                    plans: newPlans,
                    planPromise: Promise.resolve(newPlans),
                    isLoading: false
                };
            });
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },
    resetPlanState: () => {
        set({ plans: null, isLoading: true, planPromise: null });
    },
});
