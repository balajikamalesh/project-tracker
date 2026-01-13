import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface Member {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: Member) => {
  return useQuery({
    queryKey: ["members", workspaceId], // refetched when workspaceId changes
    queryFn: async () => {
      const response = await client.api.members.$get({ query: { workspaceId } });
      
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const { data } = await response.json();
      return data;
    }
  });
};
