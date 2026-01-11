"use client";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

type Props = {};

const TaskViewSwitcher = (props: Props) => {
  const { isOpen, setIsOpen, open } = useCreateTaskModal();

  return (
    <Tabs className="flex-1 w-full border rounded-lg" defaultValue="table">
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
          <Button variant="teritary" onClick={open} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        Data Filter
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            Table View Content
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Kanban View Content
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            Calendar View Content
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
