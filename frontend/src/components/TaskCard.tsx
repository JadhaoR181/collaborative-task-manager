import { Trash2, Clock, User as UserIcon } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "../hooks/useTaskMutations";
import { Task } from "../hooks/useTasks";
import { useAuth } from "../context/useAuth";

const priorityConfig: Record<string, { bg: string; text: string; icon: string }> = {
  LOW: { bg: "bg-gray-100", text: "text-gray-700", icon: "🟢" },
  MEDIUM: { bg: "bg-yellow-100", text: "text-yellow-700", icon: "🟡" },
  HIGH: { bg: "bg-orange-100", text: "text-orange-700", icon: "🟠" },
  URGENT: { bg: "bg-red-100", text: "text-red-700", icon: "🔴" }
};

const statusConfig: Record<string, { bg: string; text: string }> = {
  TODO: { bg: "bg-blue-50", text: "text-blue-700" },
  IN_PROGRESS: { bg: "bg-orange-50", text: "text-orange-700" },
  REVIEW: { bg: "bg-purple-50", text: "text-purple-700" },
  COMPLETED: { bg: "bg-green-50", text: "text-green-700" }
};

export default function TaskCard({ task }: { task: Task }) {
  const { user } = useAuth();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const isCreator = user?.id === task.creatorId;
  const priorityStyle = priorityConfig[task.priority];
  const statusStyle = statusConfig[task.status];

  const handleDelete = () => {
    if (!isCreator) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    );

    if (confirmed) {
      deleteTask.mutate(task.id);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    updateTask.mutate({
      id: task.id,
      data: { status: newStatus }
    });
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 overflow-hidden">
      {/* Priority Indicator Bar */}
      <div className={`h-1.5 ${
        task.priority === 'URGENT' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
        task.priority === 'HIGH' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
        task.priority === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
        'bg-gradient-to-r from-gray-400 to-gray-500'
      }`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors flex-1 line-clamp-2">
            {task.title}
          </h3>

          <button
            onClick={handleDelete}
            disabled={!isCreator}
            title={isCreator ? "Delete task" : "Only creator can delete"}
            className={`flex-shrink-0 p-2 rounded-lg transition-all ${
              isCreator
                ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                : "text-gray-300 cursor-not-allowed opacity-50"
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Role & Priority Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {isCreator ? (
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
              <UserIcon className="w-3 h-3" />
              Creator
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              <UserIcon className="w-3 h-3" />
              Assignee
            </span>
          )}

          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
            <span>{priorityStyle.icon}</span>
            {task.priority}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {task.description || "No description provided"}
        </p>

        {/* Status Selector */}
        <div className="space-y-3">
          <div className="relative">
            <select
              value={task.status}
              onChange={e => handleStatusChange(e.target.value)}
              className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-lg text-sm font-medium border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${statusStyle.bg} ${statusStyle.text} border-transparent hover:border-gray-200`}
            >
              <option value="TODO">📋 To Do</option>
              <option value="IN_PROGRESS">⚡ In Progress</option>
              <option value="REVIEW">👀 Review</option>
              <option value="COMPLETED">✅ Completed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg className={`w-4 h-4 ${statusStyle.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated recently</span>
            </div>
            {task.status === 'COMPLETED' && (
              <span className="text-green-600 font-medium">✓ Done</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}