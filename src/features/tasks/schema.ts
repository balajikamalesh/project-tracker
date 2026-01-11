import z from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
    name: z.string().min(1, "Task name is required"),
    status: z.enum(TaskStatus).default(TaskStatus.TODO),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    workspaceId: z.string().trim().min(1, "Workspace ID is required"),
    projectId: z.string().trim().min(1, "Project ID is required"),
    assigneeId: z.string().optional(),
});