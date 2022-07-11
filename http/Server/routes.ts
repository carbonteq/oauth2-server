import app from "./bootstrap";

import interactionRoutes from "../Routes/InteractionRoutes";

app.bootstrap.use("/interaction", interactionRoutes);

app.bootstrap.use(app.oidc.callback());
