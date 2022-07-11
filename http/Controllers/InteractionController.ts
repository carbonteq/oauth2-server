import * as e from "express";
import {container} from "tsyringe";
import "reflect-metadata";

import logger from "../../src/Infrastructure/Logger/logger";
import InteractionService from "../../src/Application/Interaction/InteractionService";

const interactionService = container.resolve(InteractionService);

class InteractionController {
    static async getUid(request: e.Request, response: e.Response) {
        try {
            const httpResponse = await interactionService.getUid(request, response);
            const {uid, prompt, params, client} = httpResponse;
            if (prompt.name === "login") {
                return response.render("login", {
                    client,
                    uid,
                    details: prompt.details,
                    params,
                    title: "Sign-in",
                    flash: undefined
                });
            }

            return response.render("interaction", {
                client,
                uid,
                details: prompt.details,
                params,
                title: "Authorize"
            });
        } catch (e) {
            logger.error(e.message);
        }
    }

    static async login(request: e.Request, response: e.Response) {
        try {
            const httpResponse = await interactionService.login(request, response);
            return httpResponse;
        } catch (e) {
            logger.error(e.message);
        }
    }

    static async confirm(request: e.Request, response: e.Response) {
        try {
            const httpResponse = await interactionService.confirm(request, response);
            return httpResponse;
        } catch (e) {
            logger.error(e.message);
        }
    }

    static async abort(request: e.Request, response: e.Response) {
        try {
            const httpResponse = await interactionService.abort(request, response);
            return httpResponse;
        } catch (e) {
            logger.error(e.message);
        }
    }
}

export default InteractionController;
