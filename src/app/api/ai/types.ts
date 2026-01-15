export type TaskAI = {
  name: string;
  description: string;
  status: string;
  dueDate: string | null;
};
export type ContextAI = {
  isWorkspaceLevel: boolean;
  projectName: string | null;
  projectDescription: string | null;
  workspaceName: string | null;
  totalTasks: number;
  tasks: TaskAI[];
};
