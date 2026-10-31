import { useState } from "react";

import type { Task, Status } from "../Constants/types";
import { useToast } from "../Context/Toast";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Task 1",
    description: "This is task 1",
    assignee: "John Doe",
    status: "Backlog",
    priority: "Medium",
    tags: ["Frontend", "React"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Task 2",
    description: "Implement user authentication",
    assignee: "Peter Parker",
    status: "In Progress",
    priority: "High",
    tags: ["Backend", "Authentication"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Task 3",
    description: "Design dashboard UI",
    assignee: "Bruce Wayne",
    status: "Backlog",
    priority: "Low",
    tags: ["UI/UX", "Design"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Task 4",
    description: "Complete task management",
    assignee: "Donald Trump",
    status: "Done",
    priority: "Medium",
    tags: ["Frontend", "Tasks"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useTask = () => {
  const [allTasks, setAllTasks] = useState<Task[]>(initialTasks);

  const showToast = useToast();

  const handleMove = (id: number, status: Status, beforeId?: number) => {
    const taskExists = allTasks.some((task) => task.id === id);

    if (!taskExists || id === beforeId) return;

    try {
      setAllTasks((previousTasks) => {
        const draggedTask = previousTasks.find((task) => task.id === id);

        if (!draggedTask) return previousTasks;

        // Remove task from its previous position.
        const remainingTasks = previousTasks.filter((task) => task.id !== id);

        // Update status and timestamp.
        const updatedTask: Task = {
          ...draggedTask,
          status,
          updatedAt: new Date().toISOString(),
        };

        // Append to the destination column.
        if (beforeId === undefined) {
          return [...remainingTasks, updatedTask];
        }

        // Find target task.
        const targetIndex = remainingTasks.findIndex(
          (task) => task.id === beforeId,
        );

        if (targetIndex === -1) {
          return [...remainingTasks, updatedTask];
        }

        // Insert before target task.
        return [
          ...remainingTasks.slice(0, targetIndex),
          updatedTask,
          ...remainingTasks.slice(targetIndex),
        ];
      });

      showToast(`Task moved to ${status}`, "success");
    } catch (error) {
      showToast("Failed to move task", "error");
      console.error("Error moving task:", error);
    }
  };

  const handleEdit = (updatedTask: Task) => {
    setAllTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === updatedTask.id
          ? {
              ...updatedTask,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );

    showToast("Task updated successfully", "success");
  };

  const handleAdd = (task: Task) => {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAllTasks((previousTasks) => [...previousTasks, newTask]);

    showToast("Task added successfully", "success");
  };

  const handleDelete = (id: number) => {
    console.log("Deleting task with ID:", id); // Debugging log
    setAllTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id),
    );

    showToast("Task deleted successfully", "success");
  };

  return {
    allTasks,
    handleMove,
    handleEdit,
    handleAdd,
    handleDelete,
  };
};
