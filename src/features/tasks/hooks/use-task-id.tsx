import { useParams } from "next/navigation";
import React from "react";

const UseTaskId = () => {
  const params = useParams();
  return params.taskId as string;
};

export default UseTaskId;
