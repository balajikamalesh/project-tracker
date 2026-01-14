"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useSplitTaskModal } from "../hooks/use-split-task-modal";
import SplitTaskForm from "./split-task-form";

export const SplitTaskModal = () => {
  const { taskId, close } = useSplitTaskModal();
  return (
    <ResponsiveModal isOpen={!!taskId} onOpenChange={close}>
      {taskId && <SplitTaskForm onCancel={close} id={taskId} />}
    </ResponsiveModal>
  );
};
