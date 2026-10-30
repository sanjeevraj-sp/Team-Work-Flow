import type { Task, Status } from "../Constants/types";
import { Column } from "./TaskColumn";

interface BoardProps {
  tasks: Task[];
  statuses: readonly Status[];
  onMove: (id: number, status: Status, beforeId?: number) => void;
  onEdit: (task: Task) => void;
}

const Board = ({ tasks, statuses, onMove, onEdit }: BoardProps) => {
  return (
     <div className="mx-auto w-full max-w-7xl px-6 py-6">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onEdit={onEdit}
            onMove={onMove}
          />
        ))}
      </div>

    </div>
  );
};

export default Board;