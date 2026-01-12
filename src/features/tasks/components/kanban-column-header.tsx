import React from "react";
import { TaskStatus } from "../types";
import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

type Props = {
  lane: TaskStatus;
  taskCount: number;
};

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TaskStatus.TODO]: (
    <CircleDotDashedIcon className="size-[18px] text-red-400" />
  ),
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotIcon className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: <CircleIcon className="size-[18px] text-blue-400" />,
  [TaskStatus.IN_TESTING]: <PlusIcon className="size-[18px] text-green-400" />,
  [TaskStatus.DONE]: (
    <CircleCheckIcon className="size-[18px] text-purple-400" />
  ),
  [TaskStatus.IN_PROD]: (
    <CircleCheckIcon className="size-[18px] text-indigo-400" />
  ),
};

const KanbanColumnHeader = ({ lane, taskCount }: Props) => {
  const { open } = useCreateTaskModal();

  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      {statusIconMap[lane]}
      <div className="flex items-center gap-x-2">
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(lane)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </div>
      </div>
      <Button
        onClick={() => open(lane)}
        className="size-5 hover:bg-neutral-200"
        variant="ghost"
        size="icon"
      >
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};

export default KanbanColumnHeader;
