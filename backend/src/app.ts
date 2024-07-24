import { Hono } from "hono";
import { logger } from "hono/logger";
import { todoRoute } from "../routes/todo";

const app = new Hono();

app.use('*', logger())

app.route('/api/todo', todoRoute);

export default app;