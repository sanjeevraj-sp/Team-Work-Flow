# Architecture & Technical Notes

## Component structure

```text
main.tsx
└── ToastProvider
    └── TaskProvider
        └── App
            ├── Actions
            │   ├── Input
            │   ├── MultiSelectTabs
            │   ├── MultiSelectDropdown
            │   └── Select
            ├── TaskBoard
            │   └── TaskColumn
            │       └── TaskCard
            │           └── Modal (delete confirmation)
            └── TaskForm
                ├── Input / Textarea
                ├── Select
                ├── MultiSelectDropdown
                └── Modal
```

### Source organization

- `Components/` — page-level task components and reusable controls under `Components/ui/`.
- `Context/Task.tsx` — task provider, shared state/actions, persistence and migration.
- `Context/Toast.tsx` — application toast notifications.
- `Hooks/useTaskActions.ts` — search, filters, sorting and URL query synchronization.
- `Hooks/useTaskForm.ts` — form state, validation, dirty checking and submission.
- `Test/` — Vitest setup and React Testing Library tests.
- `Utils/` — shared utilities such as class-name helpers and relative-time formatting.

## State management

`TaskProvider` exposes two Contexts:

- **TaskStateContext** provides `allTasks` to components that need task data.
- **TaskActionsContext** provides stable operations: add, edit, delete and move/reorder.

This separation prevents components that only consume task operations from being notified whenever the task array changes. Operation callbacks use `useCallback`, the actions value uses `useMemo`, and task cards/actions use `React.memo` where appropriate.

`useTaskActions` derives filtered and sorted tasks from the shared task state. It also reads filter/sort values from the URL and updates query parameters so a view can be restored or shared. `useTaskForm` owns form behavior; `TaskForm` focuses on rendering the fields.

## Persistence and migration

Tasks are stored under `team-workflow-tasks` in `localStorage` with a `schemaVersion`.

- **V1:** older task records contain `labels` and the basic task fields.
- **V2:** `labels` is migrated to `tags`; `updatedAt`, `dueDate`, `isArchived` and `completedAt` are added.

When the app loads:
1. Read the saved data from localStorage.
2. If no data exists, create demo data in V1 format.
3. Detect the schema version.
4. If V1, transform every task into V2.
5. Save the upgraded data back to localStorage.
6. Display a migration notification.
7. If already V2, load directly without showing the notification.

## URL-based views

Search, priority, assignee, tag, sort field and sort direction are represented in query parameters. The hook reads these parameters on load and synchronizes changes back to the URL. This makes the view configuration restorable after refresh and shareable. The task records themselves remain in localStorage and are not included in the URL.

## Refactor example: reducing unnecessary renders
Refer : https://github.com/sanjeevraj-sp/Team-Work-Flow/blob/main/docs/performance.md

## Tests

Vitest runs in a `jsdom` environment. React Testing Library renders the app with its required providers, and `user-event` simulates user interactions.

- `task-creation.test.tsx` — creates a task through the form and verifies it appears on the board.
- `task-filter.test.tsx` — selects a priority filter and verifies the visible tasks and URL query.

Run with `npm run test`.
