import { Hono } from "hono";
import { logger } from "hono/logger";
import { todoRoute } from "../routes/todo";
import { authRoute } from "../routes/auth";

const app = new Hono();

app.use('*', logger())

const apiRoutes = app.basePath("/api")
.route("/todo", todoRoute)
.route("/", authRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;