import { z } from "zod";

const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
});

export { workspaceSchema };