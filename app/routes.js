import { flatRoutes } from "@react-router/fs-routes";
import { route } from "@react-router/dev/routes";

const routes = [
    ...(await flatRoutes()),
    // health route
    route("/api/health", "./api/controller/health.js"),
    route("/api/custom-restriction/*", "./api/controller/customRestriction.$.js"),
];

export default routes;
