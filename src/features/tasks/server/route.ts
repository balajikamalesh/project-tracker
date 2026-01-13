import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session";
import { Hono } from "hono";
import { createTaskSchema } from "../schema";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { Task, TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { users } = await createAdminClient();

      const { workspaceId, projectId, status, assigneeId, dueDate } =
        c.req.valid("query");

      console.log(workspaceId, projectId, status, assigneeId, dueDate);

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderAsc("$createdAt"),
      ];

      if (projectId && projectId !== "null") {
        query.push(Query.equal("projectId", projectId));
      }

      if (assigneeId && assigneeId !== "null") {
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (status && status !== "null") {
        query.push(Query.equal("status", status));
      }

      if (dueDate && dueDate !== "null") {
        query.push(Query.equal("dueDate", dueDate));
      }

      console.log("Query:", query);

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      );

      const projectIds = tasks.documents
        .map((task) => task.projectId || "")
        .filter((id) => id !== "");
      const assigneeIds = tasks.documents
        .map((task) => task.assigneeId || "")
        .filter((id) => id !== "");

      const projects = await databases.listDocuments(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (member) => member.$id === task.assigneeId
        );
        return {
          ...task,
          project: project || null,
          assignee: assignee || null,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const { taskId } = c.req.param();
    const databases = c.get("databases");
    const currentUser = c.get("user");
    const { users } = await createAdminClient();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const project = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId!
    );

    const assigneeMember = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId!
    );

    const user = await users.get(assigneeMember.userId);

    const assignee = {
      ...member,
      name: user.name,
      email: user.email,
    };

    return c.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { name, status, description, dueDate, workspaceId, projectId } =
        c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        highestPositionTask.total > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          description,
          dueDate,
          workspaceId,
          projectId,
          assigneeId: member.$id,
          position: newPosition,
        }
      );

      return c.json({ data: task });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const taskId = c.req.param("taskId");
      const user = c.get("user");
      const databases = c.get("databases");

      const { name, status, description, dueDate, projectId } =
        c.req.valid("json");

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          status,
          description,
          dueDate,
          projectId,
          assigneeId: member.$id,
        }
      );

      return c.json({ data: task });
    }
  )
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const { taskId } = c.req.param();
    const databases = c.get("databases");
    const user = c.get("user");

    console.log("Deleting task:", taskId);

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({ data: task });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.string(),
            position: z.number().int().positive().min(1000),
          })
        ),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { tasks } = c.req.valid("json");

      if (tasks.length === 0) {
        return c.json({ error: "No tasks to update" }, 400);
      }

      // Verify user authorization for the first task's workspace
      const tasksToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.contains(
            "$id",
            tasks.map((t) => t.$id)
          ),
        ]
      );

      const workspaceIds = new Set(
        tasksToUpdate.documents.map((task) => task.workspaceId)
      );

      if (workspaceIds.size > 1) {
        return c.json(
          {
            error:
              "Updating Tasks belong to multiple workspaces at the same time is not allowed",
          },
          400
        );
      }

      const workspaceId = workspaceIds.values().next().value!;

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) =>
          databases.updateDocument(DATABASE_ID, TASKS_ID, task.$id, {
            status: task.status,
            position: task.position,
          })
        )
      );

      return c.json({ data: updatedTasks });

    }
  );

export default app;
