import { toast } from "sonner";
import { InferResponseType, InferRequestType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

// Using the types exported from the RPC client to infer request and response types
type ResponseType = InferResponseType<(typeof client.api.tasks)[":taskId"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[":taskId"]["$patch"]>;

export const useUpdateTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ json, param }) => {
      debugger;
      const response = await client.api.tasks[":taskId"].$patch({ json, param });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      return await response.json();
    },
    onSuccess: ({ data}) => {
      toast.success("Task updated successfully!");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
};
