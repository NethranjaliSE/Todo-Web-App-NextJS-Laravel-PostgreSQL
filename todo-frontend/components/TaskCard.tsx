import { Task } from "@/types";
import { MoreHorizontal, Clock, Trash2 } from "lucide-react";

interface Props {
  task: Task;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, onDelete }: Props) {
  const getPriorityColor = (p: string) => {
    if (p === "Extreme") return "border-red-500 text-red-500";
    if (p === "Moderate") return "border-primary-500 text-primary-500";
    return "border-green-500 text-green-500";
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative group transition hover:shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full border-2 ${getPriorityColor(task.priority).split(" ")[0]}`}
          ></div>
          <h3 className="font-bold text-slate-800 text-md">{task.title}</h3>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDelete(task.id)}
            className="text-slate-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center text-xs text-slate-500 font-medium border-t border-slate-50 pt-3 mt-2">
        <span>
          Priority:{" "}
          <span className={getPriorityColor(task.priority).split(" ")[1]}>
            {task.priority}
          </span>
        </span>
        <span>
          Status: <span className="text-slate-700">{task.status}</span>
        </span>
        {task.due_date && (
          <span className="flex items-center gap-1">
            <Clock size={12} /> {task.due_date}
          </span>
        )}
      </div>
    </div>
  );
}
