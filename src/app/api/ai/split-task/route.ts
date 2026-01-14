import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { taskName, taskDescription, projectName } = await req.json();

    const prompt = `You are a helpful assistant that breaks down tasks into smaller, manageable subtasks for project management.

    Task Name: ${taskName}
    Task Description: ${taskDescription || "Not provided"}
    Project: ${projectName || "Not specified"}

    Based on the task name and description, generate a minimum set of subtasks (3-5 subtasks) that would be needed to complete this task. Each subtask should:
    - Be a clear, actionable item
    - Be specific and concise (one sentence or short phrase)
    - Follow a logical order
    - Cover the essential steps to complete the main task

    Return ONLY a JSON array of subtask names, nothing else. Format:
    ["Subtask 1 name", "Subtask 2 name", "Subtask 3 name"]

    Example output:
    ["Set up database schema", "Create API endpoints", "Implement frontend components", "Write tests"]

    Generate only the JSON array, no additional text or explanation.`;

    const result = streamText({
      model: google("gemini-2.0-flash"),
      prompt,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in split-task:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate subtasks" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
