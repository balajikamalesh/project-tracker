import { toast } from "sonner";
import { InferResponseType, InferRequestType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

// Using the types exported from the RPC client to infer request and response types
type ResponseType = InferResponseType<(typeof client.api.tasks)["bulk-update"]["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)["bulk-update"]["$post"]>;

export const useBulkUpdatesTasks = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["bulk-update"].$post({ json });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Tasks updated successfully!");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: unknown) => {
      toast.error("Failed to update tasks");
    },
  });
};
