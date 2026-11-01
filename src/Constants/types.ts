export const STATUSES = ['To do', 'Backlog', 'In Progress', 'Done'] as const
export type Status = (typeof STATUSES)[number]

export const PRIORITIES = ['Low', 'Medium', 'High'] as const
export type Priority = (typeof PRIORITIES)[number]

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;

  // V2 fields
  dueDate: string | null;
  isArchived: boolean;
  completedAt: string | null;
}
