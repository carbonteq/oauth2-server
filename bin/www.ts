import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

import "reflect-metadata";

import {dataSource} from "../src/Infrastructure/Database/mysqlConnections";
import app from "../http/Server";
import Config from "../src/Infrastructure/Config";
import logger from "../src/Infrastructure/Logger/logger";
import Constants from "../src/Application/Utils/Constants";


const {server} = Config;
const {STORAGE_PATH} = Constants;
const {bootstrap} = app;

const createStorage = () => {
    const dirs = Object.keys(STORAGE_PATH);
    dirs.map(d => {
        const dir = STORAGE_PATH[d];
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
    });
};

(async () => {
    try {
        await dataSource.initialize();
        createStorage();
        bootstrap.listen(server.PORT, () => {
            logger.info(
                "oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration"
            );
        });
    } catch (e) {
        logger.error(`ServerError: ${e.message}`);
    }
})();
