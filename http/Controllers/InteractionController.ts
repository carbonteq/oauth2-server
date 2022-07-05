import * as e from "express";
import {container} from "tsyringe";
import "reflect-metadata";

import app from "../Server";

import InteractionService from "../../src/Application/Interaction/InteractionService";

import logger from "../../src/Infrastructure/Logger/logger";
import UsersRepository from "../../src/Infrastructure/MysqlRepository/UsersRepository";

const oidc = app;

const interactionService = container.resolve(InteractionService);

class InteractionController {
    static async getUid(req: e.Request, res: e.Response, next: e.NextFunction) {
        try {
            const details = await app.oidc.interactionDetails(req, res);
            console.log("see what else is available to you for interaction views", details);
            const {uid, prompt, params} = details;

            const client = await app.oidc.Client.find(params.client_id as any);

            if (prompt.name === "login") {
                return res.render("login", {
                    client,
                    uid,
                    details: prompt.details,
                    params,
                    title: "Sign-in",
                    flash: undefined
                });
            }

            return res.render("interaction", {
                client,
                uid,
                details: prompt.details,
                params,
                title: "Authorize"
            });
        } catch (err) {
            return next(err);
        }
    }

    static async login(req: e.Request, res: e.Response, next: e.NextFunction) {
        try {
            const {uid, prompt, params} = await app.oidc.interactionDetails(req, res);
            const client = await app.oidc.Client.find(params.client_id as any);

            const accountId = await UsersRepository.authenticate(req.body.email, req.body.password);

            if (!accountId) {
                res.render("login", {
                    client,
                    uid,
                    details: prompt.details,
                    params: {
                        ...params,
                        login_hint: req.body.email
                    },
                    title: "Sign-in",
                    flash: "Invalid email or password."
                });
                return;
            }

            const result: any = {
                login: {accountId}
            };

            await app.oidc.interactionFinished(req, res, result, {mergeWithLastSubmission: false});
        } catch (err) {
            next(err);
        }
    }

    static async confirm(req: e.Request, res: e.Response, next: e.NextFunction) {
        try {
            const interactionDetails = await app.oidc.interactionDetails(req, res);
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
                grant = await app.oidc.Grant.find(grantId);
            } else {
                // we're establishing a new grant
                grant = new app.oidc.Grant({
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
            await app.oidc.interactionFinished(req, res, result, {mergeWithLastSubmission: true});
        } catch (err) {
            next(err);
        }
    }

    static async abort(req: e.Request, res: e.Response, next: e.NextFunction) {
        try {
            const result = {
                error: "access_denied",
                error_description: "End-User aborted interaction"
            };
            await app.oidc.interactionFinished(req, res, result, {mergeWithLastSubmission: false});
        } catch (err) {
            next(err);
        }
    }
}

export default InteractionController;
