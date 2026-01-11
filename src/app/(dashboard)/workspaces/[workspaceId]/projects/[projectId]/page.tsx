import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoProjectRoadmap } from "react-icons/go";
import { Loader, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/actions";
import { getProject } from "@/features/projects/actions";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";

interface ProjectsIdPageProps {
  params: {
    workspaceId: string;
    projectId: string;
  };
}

const ProjectsIdPage = async ({ params }: ProjectsIdPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const project = await getProject({
    projectId: params.projectId,
  });

  return (
    <div>
      {project ? (
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
          <TaskViewSwitcher />
        </div>
      ) : (
        <Loader className="animate-spin" />
      )}
    </div>
  );
};

export default ProjectsIdPage;
