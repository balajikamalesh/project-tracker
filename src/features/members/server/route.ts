import z from "zod";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session";
import { MemberRole } from "../types";
import { getMember } from "../utils";

// Fetch members of a workspace
const app = new Hono()
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const { users } = await createAdminClient();
            const databases = c.get("databases");
            const user = c.get("user");

            const { workspaceId } = c.req.valid("query");
            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            })

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            // member does not have name
            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", workspaceId)]
            )

            const populatedMembers = await Promise.all(
                members.documents.map(async (member) => {
                    const userData = await users.get(member.userId);
                    return {
                        ...member,
                        name: userData.name,
                        email: userData.email,
                    };
                })
            );

            return c.json({
                data: {
                    ...members,
                    documents: populatedMembers,
                }
            });
        }
    )
    .delete(
        "/:memberId",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const { memberId } = c.req.param();

            const memberToDelete = await databases.getDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId
            );

            const allMembersInWorkspace = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", memberToDelete.workspaceId)]
            );

            // Check if the requesting user is a member of the workspace
            const member = await getMember({
                databases,
                workspaceId: memberToDelete.workspaceId,
                userId: user.$id,
            });

            // Prevent deleting the only member of the workspace 
            if (allMembersInWorkspace.total === 1) {
                return c.json({ error: "Cannot delete the only member of the workspace" }, 400);
            }

            if (!member) return c.json({ error: "Unauthorized" }, 403);

            // Only admin can delete other members
            if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
                return c.json({ error: "Forbidden" }, 403);
            }

            await databases.deleteDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId
            );

            return c.json({ data: { $id: memberId } });
        }
    )
    .patch(
        "/:memberId",
        sessionMiddleware,
        zValidator(
            "json",
            z.object({
                role: z.nativeEnum(MemberRole).optional(),
            })
        ),
        async (c) => {
            const { memberId } = c.req.param();
            const databases = c.get("databases");
            const user = c.get("user");
            const { role } = c.req.valid("json");

            const memberToUpdate = await databases.getDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId
            );

            const allMembersInWorkspace = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", memberToUpdate.workspaceId)]
            );

            // Check if the requesting user is a member of the workspace
            const member = await getMember({
                databases,
                workspaceId: memberToUpdate.workspaceId,
                userId: user.$id,
            });

            /// Prevent updating the only member of the workspace
            if (allMembersInWorkspace.total === 1) {
                return c.json({ error: "Cannot downgrade the only member of the workspace" }, 400);
            }

            if (!member) return c.json({ error: "Unauthorized" }, 403);

            // Only admin can delete other members
            if (member.$id !== memberToUpdate.$id && member.role !== MemberRole.ADMIN) {
                return c.json({ error: "Forbidden" }, 403);
            }

            await databases.updateDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId,
                { role }
            );

            return c.json({ data: { $id: memberId } });
        }
    );

export default app;
