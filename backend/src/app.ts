import { Hono, Context} from "hono";
import { logger } from "hono/logger";
import { todoRoute } from "../routes/todo";
import { authRoute } from "../routes/auth";

const app = new Hono();

const cors = (c:Context, next: () => any) => {
    const origin = c.req.raw.headers.get("Origin")

    if (origin) {
      c.res.headers.append("Access-Control-Allow-Origin", origin);
      c.res.headers.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
      c.res.headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization");
      c.res.headers.append("Access-Control-Allow-Credentials", "true");
  }
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