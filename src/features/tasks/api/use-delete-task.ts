import { toast } from "sonner";
import { InferResponseType, InferRequestType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

// Using the types exported from the RPC client to infer request and response types
type ResponseType = InferResponseType<(typeof client.api.tasks)[":taskId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[":taskId"]["$delete"]>;

export const useDeleteTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ param }) => {
      debugger;
      const response = await client.api.tasks[":taskId"]["$delete"]({ param });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task deleted successfully!");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", data.name] });
    },
    onError: (error: unknown) => {
      toast.error("Failed to delete task");
    },
  });
};
