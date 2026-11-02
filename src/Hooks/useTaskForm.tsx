import { useEffect, useState, type FormEvent } from "react";

import type { Task, Status, Priority } from "../Constants/types";
import { useTaskOperations } from "../Context/Task";
import { useToast } from "../Context/Toast";
interface FormData {
  title: string;
  description: string;
  assignee: string;
  status: Status;
  priority: Priority;
  tags: string[];
  dueDate: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

type TouchedFields = Partial<Record<keyof FormData, boolean>>;

interface UseTaskFormProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_FORM_DATA: FormData = {
  title: "",
  description: "",
  assignee: "",
  status: "Backlog",
  priority: "Medium",
  tags: [],
  dueDate: "",
};

// Validate form fields.
const validateForm = (values: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Task title is required";
  }

  return errors;
};

export const useTaskForm = ({ task, isOpen, onClose }: UseTaskFormProps) => {
  const { handleAdd, handleEdit } = useTaskOperations();
  const showTost = useToast();

  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);

  const [initialValues, setInitialValues] =
    useState<FormData>(DEFAULT_FORM_DATA);

  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Populate form when editing or reset when creating.
  useEffect(() => {
    if (!isOpen) return;

    const values: FormData = task
      ? {
          title: task.title,
          description: task.description,
          assignee: task.assignee,
          status: task.status,
          priority: task.priority,
          tags: [...(task.tags ?? [])],
          dueDate: task.dueDate ?? "",
        }
      : { ...DEFAULT_FORM_DATA };

    setFormData(values);
    setInitialValues(values);
    setTouched({});
    setIsSubmitted(false);
  }, [task, isOpen]);

  // Check whether form values have changed.
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialValues);

  // Validate current form values.
  const errors = validateForm(formData);

  const isValid = Object.keys(errors).length === 0;

  const canSubmit = isDirty && isValid;

  // Update individual fields.
  const handleChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setTouched((previous) => ({
      ...previous,
      [field]: true,
    }));
  };

  // Track fields that the user has interacted with.
  const handleBlur = (field: keyof FormData) => {
    setTouched((previous) => ({
      ...previous,
      [field]: true,
    }));
  };

  // Show validation messages only after interaction or submission.
  const getFieldError = (field: keyof FormData) => {
    return touched[field] || isSubmitted ? errors[field] : undefined;
  };

  // Reset form and close modal.
  const handleClose = () => {
    if (isDirty) {
      showTost("Task changes discarded!", "warn");
    }

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({ ...DEFAULT_FORM_DATA, tags: [] });
    setInitialValues({ ...DEFAULT_FORM_DATA, tags: [] });
    setTouched({});
    setIsSubmitted(false);
  };

  // Add or update task.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitted(true);

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0 || !isDirty) {
      return;
    }

    const now = new Date().toISOString();

    const updatedTask: Task = {
      id: task?.id ?? 0,
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignee: formData.assignee.trim(),
      status: formData.status,
      priority: formData.priority,

      tags: formData.tags.map((tag) => tag.trim()).filter(Boolean),

      createdAt: task?.createdAt ?? now,
      updatedAt: now,

      // V2 fields
      dueDate: formData.dueDate || null,
      isArchived: task?.isArchived ?? false,

      completedAt:
        formData.status === "Done"
          ? task?.status === "Done"
            ? (task.completedAt ?? now)
            : now
          : null,
    };

    if (task) {
      handleEdit(updatedTask);
    } else {
      handleAdd(updatedTask);
    }

    // Successful submission: reset and close without cancellation toast.
    resetForm();
    onClose();
  };

  return {
    formData,
    handleChange,
    handleBlur,
    handleSubmit,
    handleClose,
    getFieldError,

    isDirty,
    isValid,
    canSubmit,
  };
};
