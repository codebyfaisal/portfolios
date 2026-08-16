import formsService from './forms.service';

export const createFormSlice = (set, get) => ({
    forms: null,
    formPromise: null,

    fetchForms: async () => {
        const { forms, formPromise } = get();

        if (forms !== null) {
            if (formPromise) return formPromise;
            const resolved = Promise.resolve(forms);
            set({ formPromise: resolved });
            return resolved;
        }

        if (formPromise) return formPromise;

        set({ isLoading: true });
        try {
            const promise = formsService.getForms().then((data) => {
                const safeData = data || [];
                set({
                    forms: safeData,
                    formPromise: Promise.resolve(safeData),
                    isLoading: false
                });
                return safeData;
            });

            set({ formPromise: promise });
            return promise;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    addForm: async (formData) => {
        set({ isLoading: true });
        try {
            const data = await formsService.createForm(formData);
            set((state) => ({
                forms: [data, ...state.forms],
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    updateForm: async (id, updates) => {
        set({ isLoading: true });
        try {
            const data = await formsService.updateForm(id, updates);
            set((state) => ({
                forms: state.forms.map((f) =>
                    f._id === id ? data : f
                ),
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    deleteForm: async (id) => {
        set({ isLoading: true });
        try {
            await formsService.deleteForm(id);
            set((state) => ({
                forms: state.forms.filter((f) => f._id !== id),
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
    resetFormState: () => {
        set({ forms: null, isLoading: true, formPromise: null });
    },
});
