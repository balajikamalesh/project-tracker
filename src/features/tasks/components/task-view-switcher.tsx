"use client";

import { Loader, PlusIcon } from "lucide-react";
import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useGetTasks } from "../api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useQueryState } from "nuqs";
import DataFilters from "./data-filters";
import { useTasksFilters } from "../hooks/use-tasks-filters";
import { DataTable } from "./data-table";
import { columns } from "./columns";

type Props = {};

const TaskViewSwitcher = (props: Props) => {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();
  const [{ status, projectId, assigneeId, search, dueDate }, setFilters] =
    useTasksFilters();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    projectId,
    assigneeId,
    dueDate,
  });

  const [view, setView] = useQueryState("view", { defaultValue: "table" }); //

  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
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
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []}/>
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              Kanban View Content {JSON.stringify(tasks, null, 2)}
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              Calendar View Content {JSON.stringify(tasks, null, 2)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
