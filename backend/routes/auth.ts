import { Hono } from "hono";
import { kindeClient, sessionManager } from "../src/kinde";

export const authRoute = new Hono()
.get("/login", async (c) => {
  const loginUrl = await kindeClient.login(sessionManager(c));
  return c.redirect(loginUrl.toString());
})
.get("/register", async (c) => {
  const loginUrl = await kindeClient.login(sessionManager(c));
  return c.redirect(loginUrl.toString());
})
.get("/callback", async (c) => {
    const url = new URL(c.req.url);
    
    await kindeClient.handleRedirectToApp(sessionManager(c), url);
    return c.redirect("http://localhost:3003/home");
  })
.get("/logout", async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  })
.get("/user", async(c) => {
      try{
        const user = await kindeClient.getUser(sessionManager(c));
      return c.json(user);
      } catch (error) {
        return c.json({error: "Getting User Error"}, 401);
      }
    
})

