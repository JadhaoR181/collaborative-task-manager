import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import TaskCard from "./TaskCard";
import TaskSkeleton from "./TaskSkeleton";

export default function TaskList() {
  const [status, setStatus] = useState<string>();
  const [priority, setPriority] = useState<string>();

  const { data, isLoading } = useTasks({ status, priority });

  return (
    <>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          onChange={e => setStatus(e.target.value || undefined)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          onChange={e => setPriority(e.target.value || undefined)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {/* Task Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <TaskSkeleton key={i} />
          ))}

        {data?.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}

        {!isLoading && data?.length === 0 && (
          <p className="text-gray-500">No tasks found.</p>
        )}
      </div>
    </>
  );
}
