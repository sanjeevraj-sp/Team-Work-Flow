import type { Task, Status } from "../Constants/types";
import { Column } from "./TaskColumn";

interface BoardProps {
  tasks: Task[];
  statuses: readonly Status[];
  onEdit: (task: Task) => void;
}

const Board = ({ tasks, statuses, onEdit }: BoardProps) => {
  return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onEdit={onEdit}
          />
        ))}
      </div>
  );
};

export default Board;