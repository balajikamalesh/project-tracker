"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { Task, TaskStatus } from "../types";
import KanbanColumnHeader from "./kanban-column-header";

const lanes: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.IN_TESTING,
  TaskStatus.DONE,
  TaskStatus.IN_PROD,
];

type TasksState = {
  [key in TaskStatus]: Task[];
};

type Props = {
  data: Task[];
};

const DataKanban = ({ data }: Props) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.IN_TESTING]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.IN_PROD]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.values(TaskStatus).forEach((status) => {
      initialTasks[status].sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex overflow-x-auto">
        {lanes.map((lane) => (
          <div
            key={lane}
            className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
          >
            <KanbanColumnHeader lane={lane} taskCount={tasks[lane].length} />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default DataKanban;
