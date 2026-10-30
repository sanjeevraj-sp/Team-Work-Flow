
import Board from "./Components/TaskBoard";

import { STATUSES } from "./Constants/types";

import { useTask } from "./Hooks/useTasks";

import "./App.css";

function App() {
  const {
    allTasks,
    handleMove,
    handleEdit,
  } = useTask();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
          <div className="grid size-9 place-items-center rounded-lg bg-indigo-600 font-semibold text-white">
            TW
          </div>

          <h1 className="text-lg font-semibold text-slate-900">
            Team Workflow Board
          </h1>
        </div>
      </header>

      {/* Board */}
      <main>
        <Board
          tasks={allTasks}
          statuses={STATUSES}
          onEdit={handleEdit}
          onMove={handleMove}
        />
      </main>

    </div>
  );
}

export default App;
