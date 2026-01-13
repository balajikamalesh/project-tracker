import React from "react";
import { MoreHorizontal } from "lucide-react";

import { Task } from "../types";
import { TaskActions } from "./task-actions";
import DottedSeparator from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TaskDate } from "./task-date";
import { GoProjectRoadmap } from "react-icons/go";

type Props = {
  task: Task;
};

const KanbanCard = ({ task }: Props) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.$id} projectId={task.projectId!}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <Avatar className="size-[27px]">
          <AvatarFallback className="bg-blue-400 text-[10px]">
            {task.assignee.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate!} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <GoProjectRoadmap />
        <span className="truncate">{task.project.name}</span>
      </div>
    </div>
  );
};

export default KanbanCard;
