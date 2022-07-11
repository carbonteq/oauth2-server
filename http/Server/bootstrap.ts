import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import {Provider, Configuration} from "oidc-provider";

import TypeORMAdapter from "../../src/Infrastructure/MysqlRepository/TypeORMAdapter";
import UsersRepository from "../../src/Infrastructure/MysqlRepository/UsersRepository";

import Config from "../../src/Infrastructure/Config";
import Constants from "../../src/Application/Utils/Constants";

const {STORAGE_PATH} = Constants;
const {server, oauth} = Config;

const jwks = JSON.parse(fs.readFileSync(`${STORAGE_PATH.JWKS_KEYS}/jwks.json`, {encoding: "utf-8"}));

const configuration: Configuration = {
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
    jwks,
    findAccount: UsersRepository.findAccount,
    claims: {
        openid: ["sub"],
        email: ["email", "email_verified"]
    },
    interactions: {
        url(ctx, interaction) {
            return `/interaction/${interaction.uid}`;
        }
    },
    features: {
        devInteractions: {enabled: false}
    }
};

const oidc = new Provider(server.APP_URL, configuration);
oidc.proxy = true;

const bootstrap = express();

bootstrap.set("trust proxy", true);
bootstrap.set("view engine", "ejs");
bootstrap.set("views", path.resolve(__dirname, "../../views"));

const limit = {
    limit: "50mb",
    extended: true
};

bootstrap.use(express.json(limit));
bootstrap.use(express.urlencoded(limit));
bootstrap.use(cors());

export default {bootstrap, oidc};
