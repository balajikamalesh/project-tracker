"use client";

import { CreateProjectForm } from "./create-project-form";
import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";

export const CreateProjectModal = () => {
  const { isOpen, open, close, setIsOpen } = useCreateProjectModal();

  return (
    <ResponsiveModal isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close}/>
    </ResponsiveModal>
  );
};
