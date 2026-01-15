"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVerticalIcon, Split, SquareChartGantt } from "lucide-react";

import { snakeCaseToTitleCase } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskActions } from "./task-actions";
import { TaskDate } from "./task-date";
import { Task } from "../types";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    maxSize: 400,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      const isParent = !row.original.parentTaskId;
      return (
        <div className="flex items-center gap-y-2">
          { isParent ? <SquareChartGantt className="mr-2 h-4 w-4 text-neutral-400" /> : <Split className="mr-2 h-4 w-4 text-neutral-400" />}
          <Link
          className="hover:underline hover:text-blue-500"
          href={`/workspaces/${row.original.workspaceId}/tasks/${row.original.$id}`}
        >
          <p className="line-clamp-1">{name}</p>
        </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <Link
            className="hover:underline hover:text-blue-500"
            href={`/workspaces/${row.original.workspaceId}/projects/${row.original.projectId}`}
          >
            <p className="line-clamp-1">{project.name}</p>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <p className="line-clamp-1">{assignee?.name || "Unassigned"}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return <TaskDate value={dueDate!} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <TaskActions task={row.original}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVerticalIcon strokeWidth={1} />
          </Button>
        </TaskActions>
      );
    },
  },
];
