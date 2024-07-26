import {
  createKindeServerClient,
  GrantType,
  SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import { type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import {  createMiddleware } from "hono/factory";

export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: process.env.KINDE_DOMAIN!,
    clientId: process.env.KINDE_CLIENT_ID!,
    clientSecret: process.env.KINDE_CLIENT_SECRET!,
    redirectURL: process.env.KINDE_REDIRECT_URI!,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
  }
);

let store: Record<string, unknown> = {};

export const sessionManager = (c: Context): SessionManager => ({
  
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  

  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: false,
      secure: false,
      sameSite: "None",
    } as const;
    

    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },

  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },

  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});

type Env = {
  Variables: {
    user: UserType;
  };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const isAuthenticaded = await kindeClient.isAuthenticated(
      sessionManager(c)
    );    

    if (isAuthenticaded) {
      const user = await kindeClient.getUserProfile(sessionManager(c));
      c.set("user", user);
      await next();
    } else {
      return c.json({ error: "User not authenticated" }, 401);
    }
  } catch (e) {
    console.log(e);
    return c.json({ error: "User not authenticated" }, 401);
  }
});
