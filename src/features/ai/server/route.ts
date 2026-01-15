import { Hono } from "hono";
import { z } from "zod";
import { streamText } from "ai";
import { Query } from "node-appwrite";
import { google } from "@ai-sdk/google";
import { zValidator } from "@hono/zod-validator";

import { buildPrompt } from "@/lib/utils";
import { sessionMiddleware } from "@/lib/session";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, PROJECTS_ID, TASKS_ID } from "@/config";

const app = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator(
    "json",
    z.object({
      workspaceId: z.string(),
      projectId: z.string().optional(),
      message: z.string(),
    })
  ),
  async (c) => {
    const user = c.get("user");
    const { workspaceId, projectId, message } = c.req.valid("json");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const databases = c.get("databases");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      // Fetch project details if projectId is provided
      let projectData = null;
      if (projectId) {
        projectData = await databases.getDocument(
          DATABASE_ID,
          PROJECTS_ID,
          projectId
        );
      }

      // Fetch tasks for the project/workspace
      const queries = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ];

      if (projectId) {
        queries.push(Query.equal("projectId", projectId));
      }

      const tasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        queries
      );

      // Build context for AI
      const context = {
        isWorkspaceLevel: !projectId,
        projectName: projectData?.name || null,
        projectDescription: projectData?.description || null,
        workspaceName: "workspace",
        totalTasks: tasks.total,
        tasks: tasks.documents.map((task: any) => ({
          name: task.name,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate,
        })),
      };

      // Generate AI response using Gemini with streaming
      const prompt = buildPrompt(message, context);
      
      const result = streamText({
        model: google("gemini-2.0-flash"),
        prompt,
        temperature: 0.7,
      });

      return result.toTextStreamResponse();
    } catch (error) {
      console.error("AI Insights error:", error);
      return c.json({ error: "Failed to generate insights" }, 500);
    }
  }
);

export default app;
