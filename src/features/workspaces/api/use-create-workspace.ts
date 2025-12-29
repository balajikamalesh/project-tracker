import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { AppwriteException } from "node-appwrite";

// Using the types esported from the RPC client to infer request and response types
type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces.$post({ form });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace created successfully!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error: unknown) => {
      toast.error("Failed to create workspace");
    },
  });
};
