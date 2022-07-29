import { ClientMetadata } from "oidc-provider";
import path from "path";

import Config from "../../Infrastructure/Config";

const {oauth} = Config;

const STORAGE_PATH = {
    JWKS_KEYS: path.resolve(__dirname, "../../../")
};

const TEST_PROJECT: ClientMetadata[] = [{
    client_id: oauth.TEST_CLIENT_ID,
    redirect_uris: oauth.TEST_REDIRECT_URI.split(" "), // using jwt.io as redirect_uri to show the ID Token contents
    response_types: ["code"],
    grant_types: ["authorization_code"],
    client_secret: oauth.TEST_CLIENT_SECRET,
    token_endpoint_auth_method: "none"
}];

export default {
    STORAGE_PATH,
    TEST_PROJECT
};
