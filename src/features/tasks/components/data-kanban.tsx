"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import KanbanCard from "./kanban-card";
import KanbanColumnHeader from "./kanban-column-header";
import { Task, TaskStatus } from "../types";

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
  onChange: (
    tasks: { $id: string; status: TaskStatus; position: number }[]
  ) => void;
};

const DataKanban = ({ data, onChange }: Props) => {
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

  useEffect(() => {
    const newTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.IN_TESTING]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.IN_PROD]: [],
    };
    data.forEach((task) => {
      newTasks[task.status].push(task);
    });
    Object.values(TaskStatus).forEach((status) => {
      newTasks[status].sort((a, b) => a.position - b.position);
    });
    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    let updatesPayload: { $id: string; status: TaskStatus; position: number }[] = [];
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      // remove the task from the source lane
      const [movedTask] = newTasks[sourceStatus].splice(source.index, 1);

      if (!movedTask) return prevTasks;

      const updatedTask =
        sourceStatus !== destStatus
          ? { ...movedTask, status: destStatus }
          : movedTask;

      newTasks[sourceStatus] = [...newTasks[sourceStatus]];

      // insert the task into the destination lane
      newTasks[destStatus].splice(destination.index, 0, updatedTask);
      newTasks[destStatus] = [...newTasks[destStatus]];

      // update positions in source lane
      newTasks[sourceStatus] = newTasks[sourceStatus].map((task, index) => ({
        ...task,
        position: Math.min((index+1) * 1000, 1_000_000),
      }));

      // update positions in destination lane
      newTasks[destStatus] = newTasks[destStatus].map((task, index) => ({
        ...task,
        position: Math.min((index+1) * 1000, 1_000_000),
      }));

      // Collect all affected tasks from source lane
      updatesPayload = newTasks[sourceStatus].map((task) => ({
        $id: task.$id,
        status: task.status,
        position: task.position,
      }));

      // Collect all affected tasks from destination lane (if different)
      if (sourceStatus !== destStatus) {
        const destUpdates = newTasks[destStatus].map((task) => ({
          $id: task.$id,
          status: task.status,
          position: task.position,
        }));
        updatesPayload = [...updatesPayload, ...destUpdates];
      }

      return newTasks;
    });

    onChange(updatesPayload);
  }, [onChange]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {lanes.map((lane) => (
          <div
            key={lane}
            className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
          >
            <KanbanColumnHeader lane={lane} taskCount={tasks[lane].length} />
            <Droppable droppableId={lane}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px] py-1.5"
                >
                  {tasks[lane].map((task, index) => (
                    <Draggable
                      key={task.$id}
                      draggableId={task.$id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <KanbanCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default DataKanban;
