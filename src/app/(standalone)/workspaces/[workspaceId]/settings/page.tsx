import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { getWorkspace } from "@/features/workspaces/actions";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";

interface WorkspaceIdSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdSettingsPage = async ({ params: { workspaceId } }: WorkspaceIdSettingsPageProps) => {
  const user = getCurrent();
  if(!user) redirect("/sign-in")

  const initialValues = await getWorkspace({ workspaceId });

  if(!initialValues) redirect(`/workspaces/${workspaceId}`);

  return <div className="w-full lg:max-w-4xl">
    <EditWorkspaceForm initialValues={initialValues}/>
  </div>;
};

export default WorkspaceIdSettingsPage;
 