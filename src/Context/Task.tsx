import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import type { Task, Status } from "../Constants/types";
import { useToast } from "./Toast";

const STORAGE_KEY = "team-workflow-tasks";
const CURRENT_VERSION = 2;

// V1: Older task schema
interface TaskV1 {
  id: number;
  title: string;
  description: string;
  assignee: string;
  status: Status;
  priority: Task["priority"];
  labels: string[];
  createdAt: string;
}

// Versioned storage format
interface StoredTasksV1 {
  schemaVersion: 1;
  tasks: TaskV1[];
}

interface StoredTasksV2 {
  schemaVersion: 2;
  tasks: Task[];
}

// Separate Context types
interface TaskActionsContextType {
  handleAdd: (task: Task) => void;
  handleEdit: (task: Task) => void;
  handleDelete: (id: number) => void;
  handleMove: (id: number, status: Status, beforeId?: number) => void;
}

// Separate Contexts
const TaskStateContext = createContext<Task[] | null>(null);

const TaskActionsContext =
  createContext<TaskActionsContextType | null>(null);

// Demo data intentionally starts in V1 format.

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

// Keep your existing 12-task initialV1Tasks array here unchanged.
const initialV1Tasks: TaskV1[] = [
  {
    id: 1,
    title: "Implement user authentication",
    description: "Build secure login, registration and logout functionality with JWT authentication.",
    assignee: "John Doe",
    status: "In Progress",
    priority: "High",
    labels: ["Backend", "Authentication", "Security"],
    createdAt: daysAgo(12),
  },
  {
    id: 2,
    title: "Design dashboard interface",
    description: "Create a responsive dashboard layout with summary cards, navigation and activity sections.",
    assignee: "Bruce Wayne",
    status: "Backlog",
    priority: "Medium",
    labels: ["Frontend", "UI/UX", "Design"],
    createdAt: daysAgo(10),
  },
  {
    id: 3,
    title: "Fix task filtering issues",
    description: "Resolve incorrect results when multiple priority, assignee and tag filters are selected.",
    assignee: "Peter Parker",
    status: "In Progress",
    priority: "High",
    labels: ["Frontend", "React", "Bug Fix"],
    createdAt: daysAgo(9),
  },
  {
    id: 4,
    title: "Create reusable button components",
    description: "Develop reusable button variants with consistent styling, sizes and disabled states.",
    assignee: "Diana Prince",
    status: "Done",
    priority: "Low",
    labels: ["Frontend", "React", "Components"],
    createdAt: daysAgo(15),
  },
  {
    id: 5,
    title: "Integrate payment gateway",
    description: "Integrate the payment provider API and handle successful, failed and pending transactions.",
    assignee: "Clark Kent",
    status: "Backlog",
    priority: "High",
    labels: ["Backend", "API", "Payments"],
    createdAt: daysAgo(7),
  },
  {
    id: 6,
    title: "Optimize application performance",
    description: "Identify unnecessary component re-renders and improve initial page loading performance.",
    assignee: "Natasha Romanoff",
    status: "In Progress",
    priority: "Medium",
    labels: ["React", "Performance", "Optimization"],
    createdAt: daysAgo(6),
  },
  {
    id: 7,
    title: "Write unit tests for authentication",
    description: "Add unit tests covering login validation, token generation and authentication failures.",
    assignee: "John Doe",
    status: "Backlog",
    priority: "Medium",
    labels: ["Testing", "Backend", "Authentication"],
    createdAt: daysAgo(5),
  },
  {
    id: 8,
    title: "Implement responsive navigation",
    description: "Make the sidebar and navigation menu responsive across desktop, tablet and mobile devices.",
    assignee: "Bruce Wayne",
    status: "Done",
    priority: "Medium",
    labels: ["Frontend", "Responsive", "UI/UX"],
    createdAt: daysAgo(18),
  },
  {
    id: 9,
    title: "Fix API error handling",
    description: "Standardize API error responses and display meaningful error messages to users.",
    assignee: "Peter Parker",
    status: "In Progress",
    priority: "High",
    labels: ["Backend", "API", "Bug Fix"],
    createdAt: daysAgo(4),
  },
  {
    id: 10,
    title: "Create user profile page",
    description: "Build a profile page where users can view and update their personal information.",
    assignee: "Diana Prince",
    status: "Backlog",
    priority: "Low",
    labels: ["Frontend", "React", "UI/UX"],
    createdAt: daysAgo(3),
  },
  {
    id: 11,
    title: "Add database indexing",
    description: "Analyze frequently executed queries and introduce indexes to improve database performance.",
    assignee: "Clark Kent",
    status: "Done",
    priority: "High",
    labels: ["Database", "Backend", "Optimization"],
    createdAt: daysAgo(20),
  },
  {
    id: 12,
    title: "Prepare application deployment",
    description: "Configure production environment variables, build scripts and deployment pipeline.",
    assignee: "Natasha Romanoff",
    status: "Backlog",
    priority: "Medium",
    labels: ["DevOps", "Deployment", "Configuration"],
    createdAt: daysAgo(2),
  },
];

// Convert V1 tasks into V2 tasks.
const migrateV1ToV2 = (oldTasks: TaskV1[]): Task[] => {
  return oldTasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    assignee: task.assignee,
    status: task.status,
    priority: task.priority,

    // Rename V1 labels to V2 tags.
    tags: task.labels ?? [],

    createdAt: task.createdAt,
    updatedAt: task.createdAt,

    // New V2 fields.
    dueDate: null,
    isArchived: false,
    completedAt: null,
  }));
};

// Load and migrate saved data.
const loadTasks = (): {
  tasks: Task[];
  migrated: boolean;
} => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    // First-time load: simulate an older V1 installation.
    if (!storedData) {
      const v1Data: StoredTasksV1 = {
        schemaVersion: 1,
        tasks: initialV1Tasks,
      };

      return {
        tasks: migrateV1ToV2(v1Data.tasks),
        migrated: true,
      };
    }

    const parsedData = JSON.parse(storedData);

    if (parsedData.schemaVersion < CURRENT_VERSION) {
      return {
        tasks: migrateV1ToV2(parsedData.tasks),
        migrated: true,
      };
    } else  {
      return {
        tasks: parsedData.tasks,
        migrated: false,
      };
    }

  } catch (error) {
    console.error("Failed to load tasks:", error);

    return {
      tasks: migrateV1ToV2(initialV1Tasks),
      migrated: true,
    };
  }
};

export const TaskProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [initialData] = useState(loadTasks);

  // Task state is managed independently.
  const [allTasks, setAllTasks] = useState<Task[]>(
    initialData.tasks
  );

  const wasMigrated = initialData.migrated;

  const showToast = useToast();

  // Keep the latest toast function without changing task callbacks.
  const showToastRef = useRef(showToast);

  const migrationToastShown = useRef(false);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  // Persist the current V2 schema.
  useEffect(() => {
    const storageData: StoredTasksV2 = {
      schemaVersion: CURRENT_VERSION,
      tasks: allTasks,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(storageData)
    );
  }, [allTasks]);

  // Notify only when migration actually happened.
  useEffect(() => {
    if (wasMigrated && !migrationToastShown.current) {
      migrationToastShown.current = true;

      showToastRef.current(
        "Task data successfully migrated to V2",
        "success"
      );
    }
  }, [wasMigrated]);

  // Add task.
  const handleAdd = useCallback((task: Task) => {
    const now = new Date().toISOString();

    const newTask: Task = {
      ...task,
      id: Date.now(),
      createdAt: now,
      updatedAt: now,
      dueDate: task.dueDate ?? null,
      isArchived: task.isArchived ?? false,
      completedAt: task.completedAt ?? null,
    };

    setAllTasks((previous) => [...previous, newTask]);

    showToastRef.current(
      "Task added successfully",
      "success"
    );
  }, []);

  // Edit task.
  const handleEdit = useCallback((updatedTask: Task) => {
    const now = new Date().toISOString();

    setAllTasks((previous) =>
      previous.map((task) =>
        task.id === updatedTask.id
          ? {
              ...updatedTask,
              updatedAt: now,
            }
          : task
      )
    );

    showToastRef.current(
      "Task updated successfully",
      "success"
    );
  }, []);

  // Delete task.
  const handleDelete = useCallback((id: number) => {
    setAllTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );

    showToastRef.current(
      "Task deleted successfully",
      "success"
    );
  }, []);

  // Move or reorder task.
  const handleMove = useCallback(
    (id: number, status: Status, beforeId?: number) => {
      const now = new Date().toISOString();

      setAllTasks((previous) => {
        const draggedTask = previous.find(
          (task) => task.id === id
        );

        if (!draggedTask || id === beforeId) {
          return previous;
        }

        const remaining = previous.filter(
          (task) => task.id !== id
        );

        const updatedTask: Task = {
          ...draggedTask,
          status,
          updatedAt: now,
          completedAt:
            status === "Done"
              ? draggedTask.completedAt ?? now
              : null,
        };

        if (beforeId === undefined) {
          return [...remaining, updatedTask];
        }

        const targetIndex = remaining.findIndex(
          (task) => task.id === beforeId
        );

        if (targetIndex === -1) {
          return [...remaining, updatedTask];
        }

        return [
          ...remaining.slice(0, targetIndex),
          updatedTask,
          ...remaining.slice(targetIndex),
        ];
      });

      showToastRef.current(
        `Task moved to ${status}`,
        "success"
      );
    },
    []
  );

  // Memoize the actions Context value.
  const actions = useMemo(
    () => ({
      handleAdd,
      handleEdit,
      handleDelete,
      handleMove,
    }),
    [handleAdd, handleEdit, handleDelete, handleMove]
  );

  return (
    <TaskStateContext.Provider value={allTasks}>
      <TaskActionsContext.Provider value={actions}>
        {children}
      </TaskActionsContext.Provider>
    </TaskStateContext.Provider>
  );
};

// Access task state.
export const useTaskState = () => {
  const context = useContext(TaskStateContext);

  if (context === null) {
    throw new Error(
      "useTaskState must be used inside TaskProvider"
    );
  }

  return context;
};

// Access task operations.
export const useTaskOperations = () => {
  const context = useContext(TaskActionsContext);

  if (context === null) {
    throw new Error(
      "useTaskOperations must be used inside TaskProvider"
    );
  }

  return context;
};
