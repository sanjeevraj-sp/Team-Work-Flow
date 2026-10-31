
import { useEffect, useState, type FormEvent } from "react";

import type { Task, Status, Priority } from "../Constants/types";
import Modal from "./ui/model";
import { STATUSES, PRIORITIES } from "../Constants/types";
import { Button } from "./ui/button";

interface TaskFormProps {
  isOpen: boolean;
  task: Task | null;
  setEditingTask?: (task: Task | null) => void;
  onClose: () => void;
  onSubmit: (task: Task) => void;
}

interface FormData {
  title: string;
  description: string;
  assignee: string;
  status: Status;
  priority: Priority;
  tags: string;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  assignee: "",
  status: "Backlog",
  priority: "Medium",
  tags: "",
};

const TaskForm = ({
  isOpen,
  task,
  setEditingTask,
  onClose,
  onSubmit,
}: TaskFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Populate form when editing or reset when creating.
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        status: task.status,
        priority: task.priority,
        tags: task.tags.join(", "),
      });
    } else {
      setFormData(initialFormData);
    }
  }, [task, isOpen]);

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.title.trim()) return;

    const now = new Date().toISOString();

    const updatedTask: Task = {
      id: task?.id ?? Date.now(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignee: formData.assignee.trim(),
      status: formData.status,
      priority: formData.priority,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: task?.createdAt ?? now,
      updatedAt: now,
    };

    onSubmit(updatedTask);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setFormData(initialFormData);
        if (setEditingTask) {
          setEditingTask(null);
        }
        onClose();
      }}
      title={task ? "Edit Task" : "Create New Task"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 text-left">
            Title *
          </label>

          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter task title"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 text-left">
            Description
          </label>

          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter task description"
            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Assignee */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 text-left">
            Assignee
          </label>

          <input
            type="text"
            value={formData.assignee}
            onChange={(e) => handleChange("assignee", e.target.value)}
            placeholder="Enter assignee name"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 text-left">
              Status
            </label>

            <select
              value={formData.status}
              onChange={(e) =>
                handleChange("status", e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 text-left">
              Priority
            </label>

            <select
              value={formData.priority}
              onChange={(e) =>
                handleChange("priority", e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Tags */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 text-left">
            Tags
          </label>

          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="Frontend, React, UI/UX"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-1 text-xs text-slate-400">
            Separate multiple tags using commas.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
                setFormData(initialFormData);
                if (setEditingTask) {
                  setEditingTask(null);
                }
                onClose();
            }}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary">
            {task ? "Save Changes" : "Create Task"}
          </Button>
        </div>

      </form>
    </Modal>
  );
};

export default TaskForm;
