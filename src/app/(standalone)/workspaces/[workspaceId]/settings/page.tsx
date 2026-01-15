import { redirect } from "next/navigation";
import { Metadata } from "next";

import { getCurrent } from "@/features/auth/actions";
import WorkspaceIdSettingsClient from "./client";

export const metadata: Metadata = {
  title: "Trackly  |  Settings"
};

const WorkspaceIdSettingsPage = async () => {
  const user = getCurrent();
  if(!user) redirect("/sign-in")

  return <WorkspaceIdSettingsClient />
};

export default WorkspaceIdSettingsPage;
 