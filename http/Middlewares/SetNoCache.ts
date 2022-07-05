import * as e from "express";
const SetNoCache = (request: e.Request, response: e.Response, next: e.NextFunction) => {
    response.set("Pragma", "no-cache");
    response.set("Cache-Control", "no-cache, no-store");
    next();
};

export default SetNoCache