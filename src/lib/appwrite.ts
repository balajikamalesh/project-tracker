import "server-only";

import { Client, Databases, Account, Storage, Users } from "node-appwrite";

// Create and export an Appwrite client with admin privileges to create user
export async function createAdminClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);

    return {
        get account() {
            return new Account(client);
        }
    };
}