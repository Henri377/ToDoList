import { Hono } from "hono";
import { logger } from "hono/logger";
import { todoRoute } from "../routes/todo";

const app = new Hono();

app.use('*', logger())

const apiRoutes = app.basePath("/api")
.route("/todo", todoRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;