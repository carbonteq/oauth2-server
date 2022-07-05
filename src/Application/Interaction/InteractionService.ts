import {injectable} from "tsyringe";
import app from "../../../http/Server";

import logger from "../../Infrastructure/Logger/logger";
import UsersRepository from "../../Infrastructure/MysqlRepository/UsersRepository";

const oidc = app;

@injectable()
class InteractionService {
    async getUid(request, response) {
        try {
            const details = await oidc.oidc.interactionDetails(request, response);
            console.log("see what else is available to you for interaction views", details);

            const {uid, prompt, params} = details;
            const client = await oidc.oidc.Client.find(params.client_id as any);

            return {
                uid,
                prompt,
                params,
                client
            };
        } catch (e) {
            logger.error(e.message);
        }
    }

    async login(request, response) {
        try {
            const {uid, prompt, params} = await oidc.oidc.interactionDetails(request, response);
            const client = await oidc.oidc.Client.find(params.client_id as any);

            const accountId = await UsersRepository.authenticate(request.body.email, request.body.password);

            if (!accountId) {
                response.render("login", {
                    client,
                    uid,
                    details: prompt.details,
                    params: {
                        ...params,
                        login_hint: request.body.email
                    },
                    title: "Sign-in",
                    flash: "Invalid email or password."
                });
                return;
            }

            const result = {
                login: {accountId}
            };

            await oidc.oidc.interactionFinished(request, response, result as any, {mergeWithLastSubmission: false});
        } catch (e) {
            logger.error(e.message);
        }
    }

    async confirm(request, response) {
        try {
            const interactionDetails = await oidc.oidc.interactionDetails(request, response);
            const {
                prompt: {name, details},
                params,
                session: {accountId}
            } = interactionDetails;

            const d: any = details;
            let {grantId} = interactionDetails;
            let grant;

            if (grantId) {
                // we'll be modifying existing grant in existing session
                grant = await oidc.oidc.Grant.find(grantId);
            } else {
                // we're establishing a new grant
                grant = new oidc.oidc.Grant({
                    accountId,
                    clientId: params.client_id as any
                });
            }

            if (d.missingOIDCScope) {
                grant.addOIDCScope(d.missingOIDCScope.join(" "));
                // use grant.rejectOIDCScope to reject a subset or the whole thing
            }
            if (d.missingOIDCClaims) {
                grant.addOIDCClaims(d.missingOIDCClaims);
                // use grant.rejectOIDCClaims to reject a subset or the whole thing
            }
            if (details.missingResourceScopes) {
                // eslint-disable-next-line no-restricted-syntax
                for (const [indicator, scopes] of Object.entries(d.missingResourceScopes)) {
                    const s: any = scopes;
                    grant.addResourceScope(indicator, s.join(" "));
                    // use grant.rejectResourceScope to reject a subset or the whole thing
                }
            }

            grantId = await grant.save();

            const consent: any = {};
            if (!interactionDetails.grantId) {
                // we don't have to pass grantId to consent, we're just modifying existing one
                consent.grantId = grantId;
            }

            const result = {consent};
            await oidc.oidc.interactionFinished(request, response, result, {mergeWithLastSubmission: true});
        } catch (e) {
            logger.error(e.message);
        }
    }

    async abort(request, response) {
        try {
            const result = {
                error: "access_denied",
                error_description: "End-User aborted interaction"
            };
            await oidc.oidc.interactionFinished(request, response, result, {mergeWithLastSubmission: false});
        } catch (e) {
            logger.error(e.message);
        }
    }
}

export default InteractionService;
