"use client";

import { Loader } from "lucide-react";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const WorkspaceIdSettingsClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading } = useGetWorkspace({ workspaceId });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-4 animate-spin" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Workspace not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:max-w-4xl">
      <EditWorkspaceForm initialValues={workspace!} />
    </div>
  );
};

export default WorkspaceIdSettingsClient;