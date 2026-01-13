import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { taskName, projectName, currentDescription } = await req.json();

    const prompt = `You are a helpful assistant that generates detailed task descriptions for project management.

Task Name: ${taskName}
Project: ${projectName || "Not specified"}
Current Description: ${currentDescription || "None"}

Based on the task name${
      projectName ? " and project context" : ""
    }, generate a clear, concise, and actionable task description. The description should:
- Be 2-4 sentences long, include line breaks and bullet points if necessary
- Explain what needs to be done
- Include any relevant technical details or considerations
- Be specific and actionable

Generate only the task description, nothing else.`;

    const result = streamText({
      model: google("gemini-2.0-flash"),
      prompt,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in complete-description:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate description" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
