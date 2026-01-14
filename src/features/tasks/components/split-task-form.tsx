import DottedSeparator from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetProject } from "@/features/projects/api/use-get-project";
import useProjectId from "@/features/projects/hooks/use-project-id";
import { Loader, Sparkles, RefreshCw } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useGetTask } from "../api/use-get-task";
import { Button } from "@/components/ui/button";
import { useCompletion } from "@ai-sdk/react";
import { toast } from "sonner";
import { useBulkCreateTasks } from "../api/use-bulk-create-tasks";
import { createTaskSchema } from "../schema";

type Props = {
  onCancel?: () => void;
  id: string;
};

const SplitTaskForm = ({ onCancel, id }: Props) => {
  const projectId = useProjectId();
  const { data: project, isLoading: projectLoading } = useGetProject({ projectId });
  const { data: task, isLoading: taskLoading } = useGetTask({ taskId: id });

  const { mutate: bulkCreateTasks } = useBulkCreateTasks();
  
  const [subtasks, setSubtasks] = useState<string[]>([]);

  const { complete, completion, isLoading: isGenerating } = useCompletion({
    api: "/api/ai/split-task",
    streamProtocol: "text",
    onError: (error) => {
      console.error("Error generating subtasks:", error);
      toast.error("Failed to generate subtasks");
    },
  });

  const isLoading = projectLoading || taskLoading;

  useEffect(() => {
    if (completion) {
      try {
        // Extract JSON array from the completion
        const jsonMatch = completion.match(/\[.*\]/s);
        if (jsonMatch) {
          const parsedSubtasks = JSON.parse(jsonMatch[0]);
          setSubtasks(parsedSubtasks);
        }
      } catch (error) {
        console.error("Parse error:", error);
      }
    }
  }, [completion]);

  const generateSubtasks = async () => {
    if (!task || !project) return;

    setSubtasks([]);
    await complete("", {
      body: {
        taskName: task.name,
        taskDescription: task.description || "",
        projectName: project.name,
      },
    });
  };

  const createSubtasks = async () => {
    const parsedSubtasks = subtasks.map((name) => ({
      name,
      description: "",
      projectId: projectId,
      workspaceId: project?.workspaceId!,
      dueDate: task?.dueDate!,
      status: task?.status!,
      parentTaskId: task?.$id,
    }));

    bulkCreateTasks({
      json: { tasks: parsedSubtasks }
    }, {
      onSuccess: () => {
        onCancel?.();
      }
    })
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="size-4 animate-spin" />
      </div>
    );
  }

  if (!project || !task) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Task or Project not found.</p>
      </div>
    );
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Split Task - {project?.name}
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {subtasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700">
            <Button
              onClick={generateSubtasks}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  AI Task Split
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Subtasks</h3>
              <Button
                onClick={generateSubtasks}
                disabled={isGenerating}
                variant="outline"
                size="sm"
              >
                {isGenerating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </>
                )}
              </Button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
              <ul className="space-y-3">
                {subtasks.map((subtask, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700"
                  >
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm">{subtask}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 justify-end pt-4">
              <Button
                onClick={onCancel}
                variant="outline"
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                onClick={createSubtasks}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isGenerating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Subtasks"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SplitTaskForm;
