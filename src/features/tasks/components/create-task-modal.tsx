"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import CreateTaskFormWrapper from "./create-task-form-wrapper";

export const CreateTaskModal = () => {
  const { isOpen, close, setIsOpen, initialStatus } = useCreateTaskModal();
  return (
    <ResponsiveModal isOpen={isOpen} onOpenChange={setIsOpen}>
      <div>
        <CreateTaskFormWrapper onCancel={close} initialStatus={initialStatus}/>
      </div>
    </ResponsiveModal>
  );
};
