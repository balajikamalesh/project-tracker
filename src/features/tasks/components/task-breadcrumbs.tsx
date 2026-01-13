import { Project } from "@/features/projects/types";
import React from "react";
import { Task } from "../types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  project: Project;
  task: Task;
};

const TaskBreadcrumbs = ({ project, task }: Props) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { mutate, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete Task",
    message:
      "Are you sure you want to delete this task? This action cannot be undone.",
    variant: "destructive",
  });

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
          toast.success("Task deleted successfully");
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <Avatar className="size-[36px]">
        <AvatarFallback className="bg-blue-400">
          {project.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        className="ml-auto"
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={handleDeleteTask}
      >
        <TrashIcon />
        Delete
      </Button>
    </div>
  );
};

export default TaskBreadcrumbs;
