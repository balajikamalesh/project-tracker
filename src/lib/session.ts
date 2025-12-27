import "server-only";

import {
    Account,
    Client,
    Databases,
    Models,
    Storage,
    type Account as AccountType,
    type Databases as DatabaseType,
    type Storage as StorageType,
    type Users as UsersType,
} from "node-appwrite";

import { getCookie } from "hono/cookie";
import { createFactory, createMiddleware } from "hono/factory";
import { AUTH_COOKIE_NAME } from "@/features/auth/constants";

// Define the context type for the session middleware
type SessionContext = {
    Variables: {
        account: AccountType;
        databases: DatabaseType;
        storage: StorageType;
        users: UsersType;
        user: Models.User<Models.Preferences>;
    };
};

// Create the session middleware
export const sessionMiddleware = createMiddleware<SessionContext>(
    async (ctx, next) => {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        const sessionCookie = getCookie(ctx, AUTH_COOKIE_NAME);
        if (!sessionCookie) {
            return ctx.json({ error: "Unauthorized" }, 401);
        }

        client.setSession(sessionCookie);

        const account = new Account(client);
        const databases = new Databases(client);
        const storage = new Storage(client);

        const user = await account.get();

        // Set the context variables
        ctx.set("account", account);
        ctx.set("databases", databases);
        ctx.set("storage", storage);
        ctx.set("user", user);

        await next();
    }
);
