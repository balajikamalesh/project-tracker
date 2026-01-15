import { useParams } from "next/navigation";

const UseTaskId = () => {
  const params = useParams();
  return params.taskId as string;
};

export default UseTaskId;
