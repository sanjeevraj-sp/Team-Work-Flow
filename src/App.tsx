import { useState } from "react";

import Actions from "./Components/Actions";
import Board from "./Components/TaskBoard";
import TaskForm from "./Components/TaskForm";

import { Button } from "./Components/ui/button";

import { STATUSES } from "./Constants/types";
import type { Task } from "./Constants/types";

import { useTask } from "./Hooks/useTasks";

import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { allTasks, handleMove, handleAdd, handleEdit, handleDelete } = useTask();

  // Open modal for editing
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Submit form
  const handleSubmit = (task: Task) => {
    if (editingTask) {
      handleEdit(task);
    } else {
      handleAdd(task);
    }

    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div>
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-lg bg-indigo-600 font-semibold text-white">
                TW
              </div>

              <h1 className="text-lg font-semibold text-slate-900">
                Team Workflow Board
              </h1>
            </div>

            {/* Create Task */}
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
            >
              + New Task
            </Button>
          </div>
        </header>

        {/* Board */}
        <main>
          <div className="mx-auto w-full max-w-7xl px-6 py-6">
            <div>
              <Actions />
            </div>

            <div>
              <Board
                tasks={allTasks}
                statuses={STATUSES}
                onEdit={handleEditClick}
                onMove={handleMove}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </main>
      </div>

      <div>
        <TaskForm
          isOpen={isModalOpen}
          task={editingTask}
          setEditingTask={setEditingTask}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default App;
