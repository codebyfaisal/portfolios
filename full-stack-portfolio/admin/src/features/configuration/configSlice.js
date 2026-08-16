import configService from './config.service';

export const createConfigSlice = (set) => ({
    config: { rounded: true },

    updateConfig: async (configData) => {
        set((state) => ({
            config: { ...state.config, ...configData }
        }));
        try {
            await configService.updateConfig(configData);
        } catch (err) {
            console.error("Config update failed", err);
            throw err;
        }
    },

    getConfig: async () => {
        try {
            const config = await configService.getConfig();
            set((state) => ({
                config: { ...state.config, ...config }
            }));
            return config;
        } catch (e) {
            console.error("Failed to fetch config", e);
        }
    },

    resetConfigState: () => {
        set({ config: null, isLoading: true });
    },
});
