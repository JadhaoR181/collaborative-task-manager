import { useForm } from "react-hook-form";
import { useCreateTask } from "../hooks/useTaskMutations";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

interface Props {
  onClose: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateTaskForm {
  title: string;
  description: string;
  dueDate: string; // yyyy-mm-dd from input
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedToId: string;
}

export default function CreateTaskModal({ onClose }: Props) {
  const { register, handleSubmit } = useForm<CreateTaskForm>();
  const createTask = useCreateTask();

  // 🔹 Fetch users for dropdown
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    }
  });

  const onSubmit = async (data: CreateTaskForm) => {
    const payload = {
      ...data,
      // ✅ convert date → ISO datetime for backend
      dueDate: new Date(data.dueDate).toISOString()
    };

    await createTask.mutateAsync(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create Task</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <input
            {...register("title", { required: true })}
            placeholder="Task title"
            className="w-full px-3 py-2 border rounded"
          />

          {/* Description */}
          <textarea
            {...register("description", { required: true })}
            placeholder="Task description"
            className="w-full px-3 py-2 border rounded"
          />

          {/* Due date */}
          <input
            {...register("dueDate", { required: true })}
            type="date"
            className="w-full px-3 py-2 border rounded"
          />

          {/* Priority */}
          <select
            {...register("priority", { required: true })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Assigned user dropdown */}
          <select
            {...register("assignedToId", { required: true })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Assign to user</option>

            {isLoading && (
              <option disabled>Loading users...</option>
            )}

            {users?.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 rounded border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createTask.isPending}
              className="px-4 py-1 bg-indigo-600 text-white rounded"
            >
              {createTask.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
