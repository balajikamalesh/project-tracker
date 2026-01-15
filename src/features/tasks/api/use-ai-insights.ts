import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.ai.insights)["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.ai.insights)["$post"]
>["json"];

export const useAIInsights = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.ai.insights.$post({ json });

      if (!response.ok) {
        throw new Error("Failed to get AI insights");
      }

      return await response.json();
    },
  });

  return mutation;
};
