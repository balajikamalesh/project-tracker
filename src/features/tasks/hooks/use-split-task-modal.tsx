import { useQueryState, parseAsString } from "nuqs";

export const useSplitTaskModal = () => {
  const [taskId, setTaskId] = useQueryState(
    "split-task",
    parseAsString
  );

  const open = (id: string) => setTaskId(id);
  const close = () => setTaskId(null);

  return {
    taskId,
    open,
    close,
    setTaskId
  };
};
