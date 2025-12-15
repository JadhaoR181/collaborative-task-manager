import { useUpdateTask } from "../hooks/useTaskMutations";
import { Task } from "../hooks/useTasks";

export default function TaskCard({ task }: { task: Task }) {
  const updateTask = useUpdateTask();

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border">
      <h3 className="font-semibold text-lg">{task.title}</h3>

      <p className="text-sm text-gray-600 mt-1">
        {task.description}
      </p>

      <div className="flex justify-between items-center mt-4">
        <select
          value={task.status}
          onChange={e =>
            updateTask.mutate({
              id: task.id,
              data: { status: e.target.value }
            })
          }
          className="text-sm border rounded px-2 py-1"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={task.priority}
          onChange={e =>
            updateTask.mutate({
              id: task.id,
              data: { priority: e.target.value }
            })
          }
          className="text-sm border rounded px-2 py-1"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>
    </div>
  );
}
