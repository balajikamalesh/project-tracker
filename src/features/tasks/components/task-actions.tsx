import { ExternalLinkIcon, PencilIcon, Split } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTask } from "../api/use-delete-task";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { useSplitTaskModal } from "../hooks/use-split-task-modal";
import { Task, TaskStatus } from "../types";
import { toast } from "sonner";
import useProjectId from "@/features/projects/hooks/use-project-id";

type TaskActionsProps = {
  children: React.ReactNode;
  task: Task;
};

export const TaskActions = ({
  task: { $id: id, status, parentTaskId },
  children,
}: TaskActionsProps) => {
  const { mutate, isPending } = useDeleteTask();
  const projectId = useProjectId();

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete Task",
    message: "Are you sure you want to delete this task?",
    variant: "destructive",
  });

  const { open } = useEditTaskModal();
  const { open: openSplit } = useSplitTaskModal();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ param: { taskId: id } });
  };

  const onOpenSplit = () => {
    if (status !== TaskStatus.TODO && status !== TaskStatus.BACKLOG) {
      toast.error(
        "Only tasks in Backlog or To Do status can be split into subtasks."
      );
      return;
    }
    if( parentTaskId ) {
      toast.error("Subtasks cannot be split further.");
      return;
    }
    openSplit(id);
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {projectId && (
            <DropdownMenuItem
              onClick={onOpenSplit}
              className="font-medium p-[10px]"
            >
              <Split className="size-4 mr-2 stroke-2" />
              Split into Subtasks
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
