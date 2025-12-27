import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signInSchema, signUpSchema } from "../schema";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE_NAME } from "../constants";
import { sessionMiddleware } from "@/lib/session";

const loginvalidator = zValidator("json", signInSchema);
const registerValidator = zValidator("json", signUpSchema);

// This chaining will let us get the type constant in one object and share with client
// This is required to share API spec between client and server (RPC)
const app = new Hono()
  .get("/current", sessionMiddleware, async (ctx) => {
    const user = ctx.get("user");
    return ctx.json({ data: user });
  })
  .post("/login", loginvalidator, async (ctx) => {
    const { email, password } = ctx.req.valid("json");

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(ctx, AUTH_COOKIE_NAME, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return ctx.json({ success: true });
  })
  .post("/register", registerValidator, async (ctx) => {
    const { name, email, password } = ctx.req.valid("json");

    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(ctx, AUTH_COOKIE_NAME, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return ctx.json({ success: true });
  })
  .post("/logout", sessionMiddleware, async (ctx) => {
    //logout route protected with session middleware
    const account = ctx.get("account");

    deleteCookie(ctx, AUTH_COOKIE_NAME);
    await account.deleteSession("current");

    return ctx.json({ success: true });
  });

export default app;
