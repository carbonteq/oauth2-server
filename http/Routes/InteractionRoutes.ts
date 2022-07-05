import {Router} from "express";

import SetNoCache from "../Middlewares/SetNoCache";

import InteractionController from "../Controllers/InteractionController";

const router = Router();

router.get("/:uid", SetNoCache, InteractionController.getUid);

// ! check for body parser
router.post("/:uid/login", SetNoCache, InteractionController.login)
router.post("/:uid/confirm", SetNoCache, InteractionController.confirm)

router.get("/:uid/abort", SetNoCache, InteractionController.abort)

export default router;
