"use client";

import { useCallback } from "react";
import { Loader, PlusIcon } from "lucide-react";
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
import UseProjectId from "@/features/projects/hooks/use-project-id";

type Props = {
  hideProjectFilter?: boolean;
};

const TaskViewSwitcher = ({ hideProjectFilter }: Props) => {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();
  const { mutate: bulkUpdate } = useBulkUpdatesTasks();

  const currentProjectId = UseProjectId();

  const [{ status, projectId, assigneeId, search, dueDate }, setFilters] =
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
          <TabsList className="w-full lg:w-auto bg-neutral-50 p-4 h-12">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
          </TabsList>
          <Button
            variant="teritary"
            onClick={open}
            size="sm"
            className="w-full lg:w-auto"
          >
            <PlusIcon className="size-4" />
            New
          </Button>
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
    </Tabs>
  );
};

export default TaskViewSwitcher;
