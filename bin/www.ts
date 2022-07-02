import * as dotenv from "dotenv";

dotenv.config();

import "reflect-metadata";

import bootstrap from "../http/Server";
import config from "../src/Infrastructure/Config";
import logger from "../src/Infrastructure/Logger/logger";

const {server} = config;

(async () => {
    try {
        bootstrap.listen(server.PORT, () => {
            logger.info("oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration");
          });
        
    } catch (e) {
        logger.error(`ServerError: ${e.message}`);
    }
})();
