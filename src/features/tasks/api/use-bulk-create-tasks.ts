import { toast } from "sonner";
import { InferResponseType, InferRequestType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

// Using the types exported from the RPC client to infer request and response types
type ResponseType = InferResponseType<(typeof client.api.tasks)["bulk-create"]["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)["bulk-create"]["$post"]>;

export const useBulkCreateTasks = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["bulk-create"].$post({ json });
      if (!response.ok) {
        throw new Error("Failed to create tasks");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Tasks created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
    },
    onError: () => {
      toast.error("Failed to create tasks");
    },
  });
};
