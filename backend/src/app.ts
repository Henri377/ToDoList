import { Hono } from "hono";
import { logger } from "hono/logger";
import { todoRoute } from "../routes/todo";
import { authRoute } from "../routes/auth";

const app = new Hono();

const cors = (c: { res: { headers: { append: (arg0: string, arg1: string) => void; }; }; req: { method: string; }; text: (arg0: string, arg1: number) => any; }, next: () => any) => {
    c.res.headers.append("Access-Control-Allow-Origin", "*");
    c.res.headers.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    c.res.headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (c.req.method === "OPTIONS") {
      return c.text("", 204);
    }
    return next();
  };

app.use('*', logger())
app.use('*',cors)

const apiRoutes = app.basePath("/api")
.route("/todo", todoRoute)
.route("/", authRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;