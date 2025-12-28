"use server";

import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE_NAME } from "@/features/auth/constants";

export const getCurrent = async () => {
          const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        const session = cookies().get(AUTH_COOKIE_NAME);
        if (!session) {
            return null;
        }

        // Set the session on the client before accessing the user
        client.setSession(session.value);
        
        const account = new Account(client);

        return await account.get();
}