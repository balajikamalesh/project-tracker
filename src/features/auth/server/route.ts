import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signInSchema, signUpSchema } from "../schema";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE_NAME } from "../constants";

const loginvalidator = zValidator("json", signInSchema);
const registerValidator = zValidator("json", signUpSchema);

// This chaining will let us get the type constant in one object and share with client
// This is required to share API spec between client and server (RPC)
const app = new Hono()
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
  .post("/logout", async (ctx) => {
    deleteCookie(ctx, AUTH_COOKIE_NAME);

    return ctx.json({ success: true });
  });

export default app;
