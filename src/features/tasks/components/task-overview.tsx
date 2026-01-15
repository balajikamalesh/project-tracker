/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React from "react";
import { Task } from "../types";
import { Button } from "@/components/ui/button";
import { Loader, PencilIcon, Split, SquareChartGantt } from "lucide-react";
import DottedSeparator from "@/components/dotted-separator";
import OverviewProperty from "./overview-property";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TaskDate } from "./task-date";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { useGetSubTasks } from "../api/use-get-sub-tasks";
import Link from "next/link";
import { useGetTask } from "../api/use-get-task";

type Props = {
  task: Task;
};

const TaskOverview = ({ task }: Props) => {
  const { open } = useEditTaskModal();
  const { data: subTasks, isLoading } = useGetSubTasks(
    { taskId: task.$id },
    { enabled: !task.parentTaskId }
  );
  const { data: parentTask, isLoading: isLoadingParentTask } = useGetTask(
    { taskId: task.parentTaskId! },
    { enabled: !!task.parentTaskId }
  );

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button onClick={() => open(task.$id)} size="sm" variant="secondary">
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <Avatar className="size-[27px]">
              <AvatarFallback className="bg-blue-400">
                {task.assignee.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate!} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
          {!task.parentTaskId && (
            <OverviewProperty label="Sub tasks">
              <div className="flex flex-col gap-2">
                {isLoading ? (
                  <Loader className="size-4 animate-spin" />
                ) : subTasks?.documents.length! > 0 ? (
                  subTasks?.documents.map((subTask) => (
                    <Link
                      key={subTask.$id}
                      href={`/workspaces/${task.workspaceId}/tasks/${subTask.$id}`}
                      className="hover:underline"
                    >
                      <div className="flex items-center">
                        <Split className="mr-2 size-3 text-neutral-400" />
                        <p
                          key={subTask.$id}
                          className="text-sm font-medium text-muted-foreground line-clamp-1"
                        >
                          {subTask.name}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm font-medium text-muted-foreground line-clamp-1">
                    No sub-tasks found.
                  </p>
                )}
              </div>
            </OverviewProperty>
          )}
          {task.parentTaskId && (
            <OverviewProperty label="Parent Task">
              {isLoadingParentTask ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <Link
                  href={`/workspaces/${parentTask?.workspaceId}/tasks/${parentTask?.$id}`}
                  className="hover:underline"
                >
                  <div className="flex items-center">
                    <SquareChartGantt className="mr-2 size-3 text-neutral-400" />
                    <p className="text-sm font-medium text-muted-foreground line-clamp-1">
                      {parentTask?.name}
                    </p>
                  </div>
                </Link>
              )}
            </OverviewProperty>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskOverview;
