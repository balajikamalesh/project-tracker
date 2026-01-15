/* eslint-disable */
import { ContextAI } from "@/app/api/ai/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInviteCode(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function snakeCaseToTitleCase(snakeCase: string): string {
  return snakeCase
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Build prompt with project or workspace context
export function buildPrompt(userMessage: string, context: ContextAI): string {
  const tasksByStatus = context.tasks.reduce((acc: any, task: any) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {});

  const now = new Date();
  const overdueTasks = context.tasks.filter((t: any) => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < now && t.status !== "DONE";
  });

  const scopeDescription = context.isWorkspaceLevel
    ? "You are analyzing tasks across the entire workspace."
    : `You are analyzing tasks for the project "${context.projectName}".`;

  const projectInfo = context.isWorkspaceLevel
    ? `WORKSPACE-LEVEL VIEW:
- Viewing all tasks in the workspace
- Total Tasks: ${context.totalTasks}`
    : `PROJECT INFORMATION:
- Project Name: ${context.projectName}
${
  context.projectDescription
    ? `- Description: ${context.projectDescription}`
    : ""
}
- Total Tasks in Project: ${context.totalTasks}`;

  return `You are an AI assistant helping with project management insights. ${scopeDescription}

${projectInfo}

TASK BREAKDOWN BY STATUS:
${Object.entries(tasksByStatus)
  .map(([status, tasks]: [string, any]) => `- ${status}: ${tasks.length} tasks`)
  .join("\n")}

${
  overdueTasks.length > 0
    ? `OVERDUE TASKS: ${overdueTasks.length}`
    : "No overdue tasks"
}

RECENT TASKS (up to 10):
${context.tasks
  .slice(0, 10)
  .map(
    (task: any, index: number) =>
      `${index + 1}. "${task.name}" - Status: ${task.status}${
        task.description ? `, Description: ${task.description}` : ""
      }`
  )
  .join("\n")}

USER QUESTION: ${userMessage}

Please provide a helpful, concise answer based on the ${
    context.isWorkspaceLevel ? "workspace" : "project"
  } data above. If the question is about specific tasks, mention task names. Use bullet points or formatting to make the response easy to read. Keep your response under 200 words unless more detail is specifically requested.`;
}
