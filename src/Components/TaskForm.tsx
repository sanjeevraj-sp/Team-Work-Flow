import type { Task, Status, Priority } from "../Constants/types";
import { STATUSES, PRIORITIES } from "../Constants/types";

import { useTaskForm } from "../Hooks/useTaskForm";

import Input from "./ui/input";
import Select from "./ui/select";
import Textarea from "./ui/textarea";
import MultiSelectDropdown from "./ui/multiSelectDropDown";

import Modal from "./ui/model";
import { Button } from "./ui/button";

interface TaskFormProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}

const TAG_OPTIONS = [
  "Frontend",
  "Backend",
  "React",
  "Authentication",
  "Security",
  "UI/UX",
  "Design",
  "Bug Fix",
  "Components",
  "API",
  "Payments",
  "Performance",
  "Optimization",
  "Testing",
  "Responsive",
  "Database",
  "DevOps",
  "Deployment",
  "Configuration",
];

const ASSIGNEE_OPTIONS = [
  "John Doe",
  "Peter Parker",
  "Bruce Wayne",
  "Diana Prince",
  "Clark Kent",
  "Natasha Romanoff",
];

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
        <Input
          label="Title *"
          placeholder="Enter task title"
          value={formData.title}
          onChange={(value) => handleChange("title", value)}
          onBlur={() => handleBlur("title")}
        />

        {getFieldError("title") && (
          <p className="-mt-3 ml-1 text-left text-xs text-red-500">
            {getFieldError("title")}
          </p>
        )}

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Enter task description"
          value={formData.description}
          onChange={(value) => handleChange("description", value)}
          rows={3}
        />

        {/* Assignee */}
        <Select
          label="Assignee"
          value={formData.assignee}
          options={ASSIGNEE_OPTIONS}
          onChange={(value) => handleChange("assignee", value)}
        />

        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Status"
            value={formData.status}
            options={[...STATUSES]}
            onChange={(value) => handleChange("status", value as Status)}
          />

          <Select
            label="Priority"
            value={formData.priority}
            options={[...PRIORITIES]}
            onChange={(value) => handleChange("priority", value as Priority)}
          />
        </div>

        {/* Due Date */}
        <Input
          type="date"
          label="Due Date"
          value={formData.dueDate}
          onChange={(value) => handleChange("dueDate", value)}
        />

        {/* Tags */}
        <MultiSelectDropdown
          label="Tags"
          placeholder="Select task tags"
          options={TAG_OPTIONS}
          value={formData.tags}
          onChange={(value) => handleChange("tags", value)}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button type="submit" variant="primary" disabled={!canSubmit}>
            {task ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
