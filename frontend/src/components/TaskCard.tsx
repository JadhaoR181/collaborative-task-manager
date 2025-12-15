import { Task } from "../hooks/useTasks";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <span className="text-xs px-2 py-1 rounded bg-gray-200">
          {task.priority}
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-2">
        {task.description}
      </p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
        <span className="text-xs font-medium text-indigo-600">
          {task.status}
        </span>
      </div>
    </div>
  );
}
