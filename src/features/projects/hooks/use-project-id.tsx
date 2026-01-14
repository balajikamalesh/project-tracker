import { useParams } from "next/navigation";
import React from "react";

const useProjectId = () => {
  const params = useParams();
  return params.projectId as string;
};

export default useProjectId;
