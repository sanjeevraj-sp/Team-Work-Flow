
import type { Task, Status, Priority } from "../Constants/types";
import { STATUSES, PRIORITIES } from "../Constants/types";

import { useTaskForm } from "../Hooks/useTaskForm";

import Modal from "./ui/model";
import { Button } from "./ui/button";

interface TaskFormProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}

const TaskForm = ({ isOpen, task, onClose }: TaskFormProps) => {
  const {
    formData,
    handleChange,
    handleBlur,
    handleSubmit,
    handleClose,
    getFieldError,
    canSubmit,
  } = useTaskForm({
    task,
    isOpen,
    onClose,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
            onBlur={() => handleBlur("title")}
            placeholder="Enter task title"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {getFieldError("title") && (
            <p className="mt-1 text-xs text-red-500">
              {getFieldError("title")}
            </p>
          )}
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
              onChange={(e) => handleChange("status", e.target.value as Status)}
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
                handleChange("priority", e.target.value as Priority)
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

        {/* Due Date */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 text-left">
            Due Date
          </label>

          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
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
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={!canSubmit}
          >
            {task ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
