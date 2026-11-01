import { type DragEvent } from "react";

import type { Task, Status } from "../Constants/types";
import { useTaskContext } from "../Context/Task";

import { TaskCard, DRAG_DATA_TYPE } from "./TaskCard";

interface ColumnProps {
  status: Status;
  tasks: Task[];
  onEdit?: (task: Task) => void;
}

export const Column = ({ status, tasks, onEdit }: ColumnProps) => {
  const { handleMove } = useTaskContext();

  // Drop task into the column (append at the end).
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    const draggedId = Number(
      event.dataTransfer.getData(DRAG_DATA_TYPE)
    );

    if (Number.isNaN(draggedId)) return;

    handleMove(draggedId, status);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={handleDrop}
      className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100/70 transition"
    >
      {/* Column Header */}
      <div className="flex items-center gap-3 border-b border-slate-300 px-5 py-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            status === "Backlog"
              ? "bg-slate-400"
              : status === "In Progress"
                ? "bg-yellow-600"
                : status === "To do" 
                ? "bg-blue-600"
                : "bg-green-600"
          }`}
        />

        <h2 className="font-semibold text-slate-800 text-[14px]">{status}</h2>

        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
          {tasks.length}
        </span>
      </div>

      {/* Task Cards */}
      <div className="flex min-h-40 flex-col gap-2.5 p-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
          />
        ))}

        {tasks.length === 0 && (
          <p className="flex flex-1 items-center justify-center py-6 text-center text-sm text-slate-400">
            No tasks yet
          </p>
        )}
      </div>
    </div>
  );
};
