import { useParams } from "next/navigation";
import React from "react";

const UseProjectId = () => {
  const params = useParams();
  return params.projectId as string;
};

export default UseProjectId;
