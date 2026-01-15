import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import WorkspaceIdSettingsClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trackly  |  Settings"
};

const WorkspaceIdSettingsPage = async () => {
  const user = getCurrent();
  if(!user) redirect("/sign-in")

  return <WorkspaceIdSettingsClient />
};

export default WorkspaceIdSettingsPage;
 