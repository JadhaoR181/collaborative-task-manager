import { useForm } from "react-hook-form";
import { useUpdateTask } from "../hooks/useTaskMutations";
import { Task } from "../hooks/useTasks";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { X, Calendar, User, Flag, FileText, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface Props {
  task: Task;
  onClose: () => void;
}

interface UserType {
  id: string;
  name: string;
  email: string;
}

interface EditTaskForm {
  title: string;
  description: string;
  dueDate: string;
  priority: Task["priority"];
  assignedToId: string;
}

export default function EditTaskModal({ task, onClose }: Props) {
  const updateTask = useUpdateTask();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EditTaskForm>({
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split("T")[0],
      priority: task.priority,
      assignedToId: task.assignedToId || ""
    }
  });

  const { data: users, isLoading: usersLoading } = useQuery<UserType[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    }
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const onSubmit = async (data: EditTaskForm) => {
    await updateTask.mutateAsync({
      id: task.id,
      data: {
        ...data,
        dueDate: new Date(data.dueDate).toISOString()
      }
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" />
            <div>
              <h2 className="text-xl font-bold">Edit Task</h2>
              <p className="text-indigo-100 text-sm">
                Update task details
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
        >
          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Title
            </label>
            <input
              {...register("title", { required: true })}
              className="w-full mt-1 px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              rows={4}
              className="w-full mt-1 px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Due Date & Priority */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Due Date
              </label>
              <input
                type="date"
                {...register("dueDate", { required: true })}
                className="w-full mt-1 px-4 py-3 border-2 rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Flag className="w-4 h-4 text-indigo-600" />
                Priority
              </label>
              <select
                {...register("priority")}
                className="w-full mt-1 px-4 py-3 border-2 rounded-xl"
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🟠 High</option>
                <option value="URGENT">🔴 Urgent</option>
              </select>
            </div>
          </div>

          {/* Assign To */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Assign To
            </label>
            <select
              {...register("assignedToId", { required: true })}
              className="w-full mt-1 px-4 py-3 border-2 rounded-xl"
            >
              {usersLoading && <option>Loading users...</option>}
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} • {u.email}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 rounded-xl text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || updateTask.isPending}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2"
            >
              {isSubmitting || updateTask.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
