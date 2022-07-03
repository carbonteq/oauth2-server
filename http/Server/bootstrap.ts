import {Provider} from "oidc-provider";
import fs from "fs";

import TypeORMAdapter from "../../src/Infrastructure/MysqlRepository.ts/TypeORMAdapter";

import Config from "../../src/Infrastructure/Config";
import Constants from "../../src/Application/Utils/Constants";

const {STORAGE_PATH} = Constants;

const jwks = JSON.parse(fs.readFileSync(`${STORAGE_PATH.JWKS_KEYS}/jwks.json`, {encoding: "utf-8"}));

const {server, oauth} = Config;

const configuration = {
    adapter: TypeORMAdapter,
    clients: [
        {
            client_id: oauth.CLIENT_ID,
            redirect_uris: oauth.REDIRECT_URI.split(" "), // using jwt.io as redirect_uri to show the ID Token contents
            response_types: ["id_token"],
            grant_types: ["implicit"],
            token_endpoint_auth_method: "none"
        }
    ],
    cookies: {
        keys: oauth.SECURE_KEY.split(" ")
    },
    jwks
};

const app = new Provider(server.APP_URL, configuration as any);
app.proxy = true;

export default app;
