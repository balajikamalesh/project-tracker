import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

// Using the types esported from the RPC client to infer request and response types
type ResponseType = InferResponseType<(typeof client.api.workspaces[":workspaceId"])["$patch"], 200>; // Get only the positive response
type RequestType = InferRequestType<(typeof client.api.workspaces[":workspaceId"])["$patch"]>;

export const useUpdateWorkspace = () => {
    const queryClient = useQueryClient();

    return useMutation<ResponseType, unknown, RequestType>({
        mutationFn: async ({ form, param }) => {
            const response = await client.api.workspaces[":workspaceId"].$patch({ form, param });

            if (!response.ok) {
                throw new Error("Failed to update workspace");
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success("Workspace updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
        },
        onError: (error: unknown) => {
            toast.error("Failed to update workspace");
        },
    });
};
