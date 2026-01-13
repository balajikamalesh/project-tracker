import { cookies } from "next/headers";
import { Account, Client, Databases } from "node-appwrite";

import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { AUTH_COOKIE_NAME } from "../auth/constants";
import { getMember } from "../members/utils";
import { Project } from "./types";

// Fetches a specific project by ID
export const getProject = async ({ projectId }: { projectId: string }) => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE_NAME);
    if (!session) return null;

    // Set the session on the client before accessing the user
    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
    );

    const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: project.workspaceId,
    });

    if (!member) throw new Error("Unauthorized");

    return project;
};
