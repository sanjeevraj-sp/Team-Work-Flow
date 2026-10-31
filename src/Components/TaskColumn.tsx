import { type DragEvent } from "react";

import type { Task, Status } from "../Constants/types";
import { TaskCard, DRAG_DATA_TYPE } from "./TaskCard";

interface ColumnProps {
  status: Status;
  tasks: Task[];
  onMove: (id: number, status: Status, beforeId?: number) => void;
  onEdit?: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const Column = ({ status, tasks, onMove, onEdit, onDelete }: ColumnProps) => {

 function handleDrop(e: DragEvent<HTMLDivElement>) {
  e.preventDefault();

  const draggedId = Number(
    e.dataTransfer.getData(DRAG_DATA_TYPE)
  );

  if (!Number.isNaN(draggedId)) {
    onMove(draggedId, status);
  }
}

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
      }}

      onDrop={handleDrop}
      className={`overflow-hidden rounded-xl border border-slate-200 bg-slate-100/70 transition`}
    >

      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            status === "Backlog"
              ? "bg-slate-400"
              : status === "In Progress"
                ? "bg-blue-600"
                : "bg-green-600"
          }`}
        />

        <h2 className="font-semibold text-slate-800">{status}</h2>

        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
          {tasks.length}
        </span>
      </div>

      {/* Task Cards */}
      <div className="flex min-h-40 flex-col gap-2.5 p-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onMove={onMove} onEdit={onEdit} onDelete={onDelete} />
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
