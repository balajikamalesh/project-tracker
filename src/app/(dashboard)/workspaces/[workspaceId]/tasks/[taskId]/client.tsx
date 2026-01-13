"use client";

import ErrorPage from "@/app/error";
import DottedSeparator from "@/components/dotted-separator";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import TaskBreadcrumbs from "@/features/tasks/components/task-breadcrumbs";
import TaskDescription from "@/features/tasks/components/task-description";
import TaskOverview from "@/features/tasks/components/task-overview";
import UseTaskId from "@/features/tasks/hooks/use-task-id";
import { Loader } from "lucide-react";

export const TaskIdClient = () => {
  const taskId = UseTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.project} task={data} />
      <DottedSeparator className="my-6"/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
};
