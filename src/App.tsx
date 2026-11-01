import { useState } from "react";

import Actions from "./Components/Actions";
import Board from "./Components/TaskBoard";
import TaskForm from "./Components/TaskForm";

import { Button } from "./Components/ui/button";

import { STATUSES } from "./Constants/types";
import type { Task } from "./Constants/types";

import { useTaskActions } from "./Hooks/useTaskActions";

import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const taskActions = useTaskActions();

  const { displayedTasks } = taskActions;

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-indigo-600 font-semibold text-white">
              TW
            </div>

            <h1 className="text-lg font-semibold text-slate-900">
              Team Workflow Board
            </h1>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleCreate}
          >
            + New Task
          </Button>
        </div>
      </header>


      <main>
        <div className="mx-auto w-full max-w-7xl px-6 py-6">
          <Actions actions={taskActions} />

          <Board
            tasks={displayedTasks}
            statuses={STATUSES}
            onEdit={handleEditClick}
          />
        </div>
      </main>

      <TaskForm
        isOpen={isModalOpen}
        task={editingTask}
        onClose={handleClose}
      />
    </div>
  );
}

export default App;