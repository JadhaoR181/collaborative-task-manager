import { useForm } from "react-hook-form";
import { useCreateTask } from "../hooks/useTaskMutations";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { X, Calendar, User, Flag, FileText, Loader2 } from "lucide-react";
import { useEffect } from "react";

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
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedToId: string;
}

const priorityOptions = [
  { value: "LOW", label: "Low Priority", icon: "🟢", color: "text-gray-700" },
  { value: "MEDIUM", label: "Medium Priority", icon: "🟡", color: "text-yellow-700" },
  { value: "HIGH", label: "High Priority", icon: "🟠", color: "text-orange-700" },
  { value: "URGENT", label: "Urgent", icon: "🔴", color: "text-red-700" },
];

export default function CreateTaskModal({ onClose }: Props) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch 
  } = useForm<CreateTaskForm>({
    defaultValues: {
      priority: "MEDIUM"
    }
  });
  
  const createTask = useCreateTask();

  // Fetch users for dropdown
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    }
  });

  // Watch priority for visual feedback
  const selectedPriority = watch("priority");

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const onSubmit = async (data: CreateTaskForm) => {
    try {
      const payload = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString()
      };

      await createTask.mutateAsync(payload);
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Create New Task</h2>
              <p className="text-indigo-100 text-sm">Fill in the details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-h-[calc(90vh-96px)] overflow-y-auto">
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-indigo-600" />
              Task Title
              <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { 
                required: "Title is required",
                minLength: { value: 3, message: "Title must be at least 3 characters" },
                maxLength: { value: 100, message: "Title must be less than 100 characters" }
              })}
              placeholder="Enter task title (e.g., Design landing page)"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.title ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span>⚠️</span> {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-indigo-600" />
              Description
              <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description", { 
                required: "Description is required",
                minLength: { value: 10, message: "Description must be at least 10 characters" },
                maxLength: { value: 500, message: "Description must be less than 500 characters" }
              })}
              placeholder="Describe the task in detail..."
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
                errors.description ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span>⚠️</span> {errors.description.message}
              </p>
            )}
          </div>

          {/* Due Date & Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Due Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Due Date
                <span className="text-red-500">*</span>
              </label>
              <input
                {...register("dueDate", { 
                  required: "Due date is required"
                })}
                type="date"
                min={today}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.dueDate ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                }`}
              />
              {errors.dueDate && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span>⚠️</span> {errors.dueDate.message}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Flag className="w-4 h-4 text-indigo-600" />
                Priority
                <span className="text-red-500">*</span>
              </label>
              <select
                {...register("priority", { required: "Priority is required" })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none bg-white cursor-pointer ${
                  errors.priority ? "border-red-300" : "border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.25rem"
                }}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span>⚠️</span> {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Assigned User */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="w-4 h-4 text-indigo-600" />
              Assign To
              <span className="text-red-500">*</span>
            </label>
            <select
              {...register("assignedToId", { required: "Please assign this task to a user" })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none bg-white cursor-pointer ${
                errors.assignedToId ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.25rem"
              }}
            >
              <option value="">Select a team member</option>

              {usersLoading && (
                <option disabled>Loading team members...</option>
              )}

              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} • {user.email}
                </option>
              ))}
            </select>
            {errors.assignedToId && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span>⚠️</span> {errors.assignedToId.message}
              </p>
            )}
            {usersLoading && (
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading team members...
              </p>
            )}
          </div>

          {/* Priority Preview */}
          {selectedPriority && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Flag className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Task Priority</p>
                  <p className="text-lg font-bold text-gray-900">
                    {priorityOptions.find(p => p.value === selectedPriority)?.icon}{" "}
                    {priorityOptions.find(p => p.value === selectedPriority)?.label}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
              disabled={isSubmitting || createTask.isPending}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || createTask.isPending}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting || createTask.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Task...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}