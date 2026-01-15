"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Loader, PencilIcon } from "lucide-react";
import { GoProjectRoadmap } from "react-icons/go";

import Analytics from "@/components/analytics";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import useProjectId from "@/features/projects/hooks/use-project-id";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";

const ProjectIdClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: isProjectLoading } = useGetProject({ projectId });
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useGetProjectAnalytics({ projectId });

  const isLoading = isProjectLoading || isAnalyticsLoading;

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
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <GoProjectRoadmap size={24} />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics && <Analytics data={analytics} />}
      <Suspense fallback={
        <div className="h-full flex items-center justify-center">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      }>
        <TaskViewSwitcher hideProjectFilter />
      </Suspense>
    </div>
  );
};

export default ProjectIdClient;
