"use client";

import { Loader } from "lucide-react";

import { useGetProject } from "@/features/projects/api/use-get-project";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import useProjectId from "@/features/projects/hooks/use-project-id";

const ProjectIdSettingsClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-4 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:max-w-4xl">
      <EditProjectForm initialValues={project!} />
    </div>
  );
};

export default ProjectIdSettingsClient;
