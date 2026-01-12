import { Models } from "node-appwrite";

export enum TaskStatus {
    BACKLOG = "BACKLOG",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    IN_REVIEW = "IN_REVIEW",
    IN_TESTING = "IN_TESTING",
    DONE = "DONE",
    IN_PROD = "IN_PROD"
}

export type Task = Models.Document & {
    name: string;
    status: TaskStatus;
    assigneeId?: string;
    projectId?: string;
    position: number;
    dueDate?: string;
}