"use client";

import { usePathname } from "next/navigation";

import { UserButton } from "@/features/auth/components/user-button";
import MobileSidebar from "./mobile-sidebar";

const pathnameMap = {
  tasks: {
    title: "Tasks",
    description: "Manage and track all your tasks efficiently in one place.",
  },
  projects: {
    title: "Projects",
    description: "Overview of all your projects and their progress.",
  },
};

const defaultMap = {
  title: "Command Center",
  description:
    "Monitor all of your projects, track task progress, and collaborate with your team in real-time",
};

const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};

export default Navbar;
