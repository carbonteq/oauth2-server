import path from "path";

import Config from "../../Infrastructure/Config";

const {storagePath} = Config;

const STORAGE_PATH = {
    JWKS_KEYS: path.resolve(__dirname, "../../../")
};

export default {
    STORAGE_PATH
};
