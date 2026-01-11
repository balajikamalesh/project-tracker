import React from "react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetMembers } from "@/features/members/api/use-get-member";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";
import { TaskStatus } from "../types";
import { useTasksFilters } from "../hooks/use-tasks-filters";
import { Skeleton } from "@/components/ui/skeleton";
import DatePicker from "@/components/date-picker";

type DataFilterProps = {
  hideProjectFilter?: boolean;
};

const DataFilters = ({ hideProjectFilter }: DataFilterProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions =
    projects?.map((project) => ({
      value: project.$id,
      label: project.name,
    })) || [];

  const memberOptions =
    members?.documents.map((member) => ({
      value: member.$id,
      label: member.name,
    })) || [];

  const [{ status, projectId, assigneeId, search, dueDate }, setFilters] =
    useTasksFilters();

  const onValueChange = (name: string) => (value: string) => {
    let finalValue = name === "status" ? (value as TaskStatus) : value;
    setFilters({ [name]: value === "all" ? null : finalValue });
  };

  if (isLoading) {
    return <Skeleton className="h-8 w-full lg:w-1/2 rounded-md" />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={onValueChange("status")}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.IN_TESTING}>In Testing</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
          <SelectItem value={TaskStatus.IN_PROD}>In Production</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={onValueChange("assigneeId")}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="Select assignee" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          {memberOptions.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              <div className="flex items-center gap-2">{member.label}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={projectId ?? undefined}
        onValueChange={onValueChange("projectId")}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <FolderIcon className="size-4 mr-2" />
            <SelectValue placeholder="Select project" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          <SelectSeparator />
          {projectOptions.map((project) => (
            <SelectItem key={project.value} value={project.value}>
              <div className="flex items-center gap-2">{project.label}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        placeholder="Due Date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) =>
          setFilters({ dueDate: date ? date.toISOString() : null })
        }
      />
    </div>
  );
};

export default DataFilters;
