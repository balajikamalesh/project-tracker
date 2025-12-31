import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

// Using the types esported from the RPC client to infer request and response types
type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({ param });

      if(!response.ok) {
        throw new Error("Failed to reset invite code");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Invite code reset successfully!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
    },
    onError: (error: unknown) => {
      toast.error("Failed to reset invite code");
    },
  });
};
