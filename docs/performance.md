# Task Board – Performance Notes

## What was happening

When a task was deleted, the React Profiler showed unnecessary rendering across the board. The task state (`allTasks`) and task operations (add, edit, delete and move) were stored in one Context. Updating the task state changed that Context value and notified all of its consumers, including components that only needed the operations.

![Profiler before optimization](https://res.cloudinary.com/dqn1j6ibx/image/upload/f_auto/q_auto/Screenshot_2026-11-01_184044_bawmfj.png)

## Fix 1 – Split Context and memoize TaskCard

- Split the original Context into `TaskStateContext` (`allTasks`) and `TaskActionsContext` (task operations).
- Wrapped the task operation functions with `useCallback` and memoized the actions Context value with `useMemo`.
- Wrapped `TaskCard` with `React.memo` and stabilized the edit callback with `useCallback`.

**Profiler result:** total render duration decreased from **71 ms** to **16.9 ms**. The Board subtree decreased from **40.3 ms** to **3.2 ms**.

### After fix 1 – Context split and TaskCard memoization

![Profiler after fix 1](https://res.cloudinary.com/dqn1j6ibx/image/upload/f_auto/q_auto/Screenshot_2026-11-01_194429_ny8vhr.png)

## Fix 2 – Memoize Actions

Wrapped the `Actions` component with `React.memo` so it can skip parent-driven renders when its props remain unchanged.

**Profiler result:** total render duration decreased from **16.9 ms** to **15.4 ms** (a further **1.5 ms** reduction). The latest Profiler view shows the memoized Actions component.

### After fix 2 – Actions memoization

![Profiler after fix 2](https://res.cloudinary.com/dqn1j6ibx/image/upload/f_auto/q_auto/Screenshot_2026-11-01_204147_ebdexc.png)

## Overall result

Total render duration went from **71 ms** before optimization to **15.4 ms** after both fixes — a reduction of approximately **78.3%** in these recorded deletion commits.

*Measurements were taken with React DevTools Profiler during development using the task-deletion workflow. Render timings can vary between runs and are not production benchmarks.*
