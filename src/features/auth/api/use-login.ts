import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType} from "hono";
import { useRouter } from "next/navigation";

// Using the types esported from the RPC client to infer request and response types
type ResponseType = InferResponseType<typeof client.api.auth.login["$post"]>;
type RequestType = InferRequestType<typeof client.api.auth.login["$post"]>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login.$post({ json});
      return await response.json();
    },
    onSuccess: () => { 
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    }
  });
};