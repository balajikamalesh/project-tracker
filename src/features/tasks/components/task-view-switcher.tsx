"use client";

import { useCallback, useState } from "react";
import { Loader, PlusIcon, Sparkles } from "lucide-react";
import { useQueryState } from "nuqs";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useBulkUpdatesTasks } from "../api/use-bulk-update-tasks";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTasksFilters } from "../hooks/use-tasks-filters";
import { columns } from "./columns";
import DataFilters from "./data-filters";
import DataKanban from "./data-kanban";
import { DataTable } from "./data-table";
import useProjectId from "@/features/projects/hooks/use-project-id";
import { AIInsightsModal } from "./ai-insights-modal";
import { cn } from "@/lib/utils";

type Props = {
  hideProjectFilter?: boolean;
};

const TaskViewSwitcher = ({ hideProjectFilter }: Props) => {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();
  const { mutate: bulkUpdate } = useBulkUpdatesTasks();

  const currentProjectId = useProjectId();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [{ status, projectId, assigneeId, dueDate }] =
    useTasksFilters();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    projectId: currentProjectId ?? projectId,
    assigneeId,
    dueDate,
  });

  const [view, setView] = useQueryState("view", { defaultValue: "table" });

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: string; position: number }[]) => {
      bulkUpdate({ json: { tasks } });
    },
    [, bulkUpdate ]
  );

  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto bg-neutral-100 p-4 h-12">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={() => setIsAIModalOpen(true)}
              size="sm"
              className={cn(
                "flex-1 lg:flex-initial transition-all duration-300 relative overflow-hidden group",
                "hover:shadow-lg hover:shadow-purple-500/30 hover:border-purple-400",
                "hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50",
                "dark:hover:from-purple-950/30 dark:hover:to-blue-950/30",
                "hover:text-purple-700 dark:hover:text-purple-300"
              )}
            >
              <Sparkles className={cn(
                "size-4 transition-all duration-300 text-purple-500 dark:text-purple-400",
                "group-hover:rotate-12 group-hover:text-purple-600 dark:group-hover:text-purple-300"
              )} />
              <span className="group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 dark:group-hover:from-purple-400 dark:group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                AI Insights
              </span>
            </Button>
            <Button
              variant="teritary"
              onClick={() => open()}
              size="sm"
              className="flex-1 lg:flex-initial"
            >
              <PlusIcon className="size-4" />
              New
            </Button>
          </div>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                onChange={onKanbanChange}
                data={tasks?.documents ?? []}
              />
            </TabsContent>
          </>
        )}
      </div>
      <AIInsightsModal 
        isOpen={isAIModalOpen} 
        onOpenChange={setIsAIModalOpen}
      />
    </Tabs>
  );
};

export default TaskViewSwitcher;
