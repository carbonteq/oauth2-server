import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import {Provider, Configuration, ClientMetadata} from "oidc-provider";
import morgan from "morgan";

import TypeORMAdapter from "../../src/Infrastructure/MysqlRepository/TypeORMAdapter";
import UsersRepository from "../../src/Infrastructure/MysqlRepository/UsersRepository";

import Config from "../../src/Infrastructure/Config";
import Constants from "../../src/Application/Utils/Constants";

const {STORAGE_PATH, TEST_PROJECT} = Constants;
const {server, oauth} = Config;

const jwks = JSON.parse(fs.readFileSync(`${STORAGE_PATH.JWKS_KEYS}/jwks.json`, {encoding: "utf-8"}));

const configuration: Configuration = {
    adapter: TypeORMAdapter,
    clients: [
        {
            client_id: oauth.TEST_CLIENT_ID,
            redirect_uris: oauth.TEST_REDIRECT_URI.split(" "),
            response_types: ["code"],
            grant_types: ["authorization_code"],
            client_secret: oauth.TEST_CLIENT_SECRET,
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
    },
    pkce: {
        required: (ctx, client) => {
            return true;
        },
        methods: ["S256"]
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

bootstrap.use(morgan("dev"));

export default {bootstrap, oidc};
