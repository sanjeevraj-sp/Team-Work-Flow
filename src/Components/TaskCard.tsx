import { useState, type DragEvent } from "react";

import Card from "./ui/card";
import Modal from "./ui/model";

import { Trash2 } from "lucide-react";

import type { Task, Status } from "../Constants/types";

export const DRAG_DATA_TYPE = "text/plain";

interface TaskCardProps {
  task: Task;
  onMove: (id: number, status: Status, beforeId?: number) => void;
  onEdit?: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskCard = ({ task, onMove, onEdit, onDelete }: TaskCardProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const confirmDelete = () => {
    onDelete(task.id);
    setShowDeleteModal(false);
  };

  const priorityStyles = {
    Low: "bg-slate-100 text-slate-600 border-slate-200",
    Medium: "bg-orange-50 text-orange-700 border-orange-200",
    High: "bg-red-50 text-red-600 border-red-200",
  };

  const initials = task.assignee
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    setIsDragOver(false);

    // Set
    event.dataTransfer.setData(DRAG_DATA_TYPE, String(task.id));

    // Get
    const draggedId = Number(event.dataTransfer.getData(DRAG_DATA_TYPE));

    // Prevent dropping a task onto itself.
    if (!draggedId || draggedId === task.id) return;

    // Insert before the hovered task.
    onMove(draggedId, task.status, task.id);
  }

  return (
    <>
      <Card
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData(DRAG_DATA_TYPE, String(task.id));
        }}
        onDragEnd={() => setIsDragOver(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(event) => {
          const nextTarget = event.relatedTarget as Node | null;

          if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
            setIsDragOver(false);
          }
        }}
        onDrop={handleDrop}
        className={`cursor-grab ${
          isDragOver ? "border-t-4 border-t-indigo-500" : ""
        }`}
        onClick={() => onEdit && onEdit(task)}
      >
        <div className="p-3">
          {/* Title and Priority */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              {task.title}
            </h3>

            <span
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${priorityStyles[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>

          {/* Description */}
          <p className="mt-2 text-sm leading-5 text-slate-500 text-left py-1">
            {task.description}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
    
            <div className="flex items-center gap-2">
              <div className="grid size-6 place-items-center rounded-full bg-slate-200 text-[10px] font-medium text-slate-600">
                {initials}
              </div>

              <span className="text-xs text-slate-500">{task.assignee}</span>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="rounded-md p-1.5 text-red-500 transition hover:bg-red-50 hover:text-red-700"
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Task"
      >
        <p className="text-sm text-slate-600 text-left">
          Are you sure you want to delete task{" "}
          <span className="font-semibold text-slate-900">"{task.title}"</span>?
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowDeleteModal(false)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={confirmDelete}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
};
