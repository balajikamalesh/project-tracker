import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType} from "hono";

// Using the types esported from the RPC client to infer request and response types
type ResponseType = InferResponseType<typeof client.api.auth.register["$post"]>;
type RequestType = InferRequestType<typeof client.api.auth.register["$post"]>;

export const useRegister = () => {
  return useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ json }) => {
      debugger;
      const response = await client.api.auth.register.$post({ json});
      return await response.json();
    },
  });
};