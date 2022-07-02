import {Provider} from "oidc-provider";
import oauth from "../../src/Infrastructure/Config/oauth";
import server from "../../src/Infrastructure/Config/server";

const configuration = {
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
    }
};

const app = new Provider(server.APP_URL, configuration as any);
app.proxy = true;

export default app;
