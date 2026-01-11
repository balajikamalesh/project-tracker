import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import members from "@/features/members/server/route";
import workspaces from "@/features/workspaces/server/route";
import projects from "@/features/projects/server/route";
import tasks from "@/features/tasks/server/route";

// Hono.js uses code-based explicit routing unlike Next.js API routing which is file based.
// So using Hono.js for simplicity.
// By combining Hono.js and Tanstack Query, to get an end-to-end type-safe API experience.

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/members", members)
  .route("/projects", projects)
  .route("/workspaces", workspaces)
  .route("/tasks", tasks);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// this AppType contains the entire type information about all routes
// which can be imported and used in the client for type-safe API calls
export type AppType = typeof routes;
