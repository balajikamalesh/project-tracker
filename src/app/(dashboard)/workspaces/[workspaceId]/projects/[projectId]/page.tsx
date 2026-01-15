import React from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";

import { getCurrent } from "@/features/auth/actions";
import ProjectIdClient from "./client"

export const metadata: Metadata = {
  title: "Trackly  |  Project",
  description: "A project management tool to track your tasks efficiently.",
};

const ProjectsIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <ProjectIdClient />
};

export default ProjectsIdPage;
