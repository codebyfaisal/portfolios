import { Config } from "./config.model.js";

const getConfig = async () => {
    let config = await Config.findOne();
    if (!config) config = {};
    return config;
};

const updateConfig = async (configData) => {
    let config = await Config.findOne();

    if (!config) {
        config = new Config(configData);
    } else {
        const { hero, about, messageTypes, appearance, footer, navigation, maintenance } = configData;
        if (hero) config.hero = { ...config.hero, ...hero };
        if (about) config.about = { ...config.about, ...about };
        if (messageTypes) config.messageTypes = messageTypes;
        if (appearance) config.appearance = { ...config.appearance, ...appearance };
        if (footer) config.footer = { ...config.footer, ...footer };
        if (navigation) config.navigation = { ...config.navigation, ...navigation };
        if (maintenance) config.maintenance = { ...config.maintenance, ...maintenance };
    }

    await config.save();
    return config;
};

export const ConfigService = {
    getConfig,
    updateConfig
};
