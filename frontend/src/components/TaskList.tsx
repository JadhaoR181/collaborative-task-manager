import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import TaskCard from "./TaskCard";
import TaskSkeleton from "./TaskSkeleton";
import { Filter } from "lucide-react";
import { useAuth } from "../context/useAuth";


type DashboardView = "ALL" | "ASSIGNED_TO_ME" | "CREATED_BY_ME" | "OVERDUE";

export default function TaskList() {
  const [status, setStatus] = useState<string>();
  const [priority, setPriority] = useState<string>();
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [showOverdue, setShowOverdue] = useState(false);
  const [view, setView] = useState<DashboardView>("ALL");

  const { data, isLoading } = useTasks({ status, priority, sort });

  // Get current user ID (you'll need to get this from your auth context/hook)
  const { user } = useAuth();

const currentUserId = user?.id;
if (!currentUserId) return null;


  // Apply view-based filtering
 const viewFilteredTasks =
  data?.filter(task => {
    if (view === "ASSIGNED_TO_ME") return task.assignedToId === currentUserId;
    if (view === "CREATED_BY_ME") return task.creatorId === currentUserId;
    if (view === "OVERDUE") return task.isOverdue;
    return true;
  }) ?? [];


  // Apply additional filters (status, priority, overdue toggle)
  const filteredTasks = viewFilteredTasks.filter(task => {
    if (status && task.status !== status) return false;
    if (priority && task.priority !== priority) return false;
    if (showOverdue && !task.isOverdue) return false;
    return true;
  });

  // Calculate statistics based on view
  const stats = {
    total: data?.length || 0,
    assignedToMe: data?.filter(t => t.assignedToId === currentUserId).length || 0,
    createdByMe: data?.filter(t => t.creatorId === currentUserId).length || 0,
    overdue: data?.filter((t) => t.isOverdue).length || 0,
    todo: viewFilteredTasks.filter((t) => t.status === "TODO").length,
    inProgress: viewFilteredTasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: viewFilteredTasks.filter((t) => t.status === "COMPLETED").length,
  };

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Mobile: Compact Grid Cards | Desktop: Full Cards */}
      <div className="grid grid-cols-2 gap-2 md:hidden">
        <button
          onClick={() => setView("ALL")}
          className={`relative p-3 rounded-lg border transition-all text-left ${
            view === "ALL"
              ? "bg-indigo-50 border-indigo-300 shadow-sm"
              : "bg-white border-gray-200"
          }`}
        >
          <p className="text-xs font-medium text-gray-600 mb-1">All Tasks</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <div className="absolute top-2 right-2">
            <svg className={`w-5 h-5 ${view === "ALL" ? "text-indigo-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => setView("ASSIGNED_TO_ME")}
          className={`relative p-3 rounded-lg border transition-all text-left ${
            view === "ASSIGNED_TO_ME"
              ? "bg-blue-50 border-blue-300 shadow-sm"
              : "bg-white border-gray-200"
          }`}
        >
          <p className="text-xs font-medium text-gray-600 mb-1">Assigned to Me</p>
          <p className="text-2xl font-bold text-blue-600">{stats.assignedToMe}</p>
          <div className="absolute top-2 right-2">
            <svg className={`w-5 h-5 ${view === "ASSIGNED_TO_ME" ? "text-blue-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => setView("CREATED_BY_ME")}
          className={`relative p-3 rounded-lg border transition-all text-left ${
            view === "CREATED_BY_ME"
              ? "bg-green-50 border-green-300 shadow-sm"
              : "bg-white border-gray-200"
          }`}
        >
          <p className="text-xs font-medium text-gray-600 mb-1">Created by Me</p>
          <p className="text-2xl font-bold text-green-600">{stats.createdByMe}</p>
          <div className="absolute top-2 right-2">
            <svg className={`w-5 h-5 ${view === "CREATED_BY_ME" ? "text-green-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => setView("OVERDUE")}
          className={`relative p-3 rounded-lg border transition-all text-left ${
            view === "OVERDUE"
              ? "bg-red-50 border-red-300 shadow-sm"
              : "bg-white border-gray-200"
          }`}
        >
          <p className="text-xs font-medium text-gray-600 mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          <div className="absolute top-2 right-2">
            <svg className={`w-5 h-5 ${view === "OVERDUE" ? "text-red-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </button>
      </div>

      {/* Desktop: Dashboard View Cards */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setView("ALL")}
          className={`bg-white rounded-xl p-5 shadow-sm border cursor-pointer transition-all ${
            view === "ALL" 
              ? "border-indigo-500 ring-2 ring-indigo-200 shadow-md" 
              : "border-gray-100 hover:shadow-md hover:border-indigo-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">All Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              view === "ALL" ? "bg-indigo-100" : "bg-gray-100"
            }`}>
              <svg className={`w-6 h-6 ${view === "ALL" ? "text-indigo-600" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setView("ASSIGNED_TO_ME")}
          className={`bg-white rounded-xl p-5 shadow-sm border cursor-pointer transition-all ${
            view === "ASSIGNED_TO_ME" 
              ? "border-blue-500 ring-2 ring-blue-200 shadow-md" 
              : "border-gray-100 hover:shadow-md hover:border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Assigned to Me</p>
              <p className="text-3xl font-bold text-blue-600">{stats.assignedToMe}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              view === "ASSIGNED_TO_ME" ? "bg-blue-100" : "bg-gray-100"
            }`}>
              <svg className={`w-6 h-6 ${view === "ASSIGNED_TO_ME" ? "text-blue-600" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setView("CREATED_BY_ME")}
          className={`bg-white rounded-xl p-5 shadow-sm border cursor-pointer transition-all ${
            view === "CREATED_BY_ME" 
              ? "border-green-500 ring-2 ring-green-200 shadow-md" 
              : "border-gray-100 hover:shadow-md hover:border-green-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Created by Me</p>
              <p className="text-3xl font-bold text-green-600">{stats.createdByMe}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              view === "CREATED_BY_ME" ? "bg-green-100" : "bg-gray-100"
            }`}>
              <svg className={`w-6 h-6 ${view === "CREATED_BY_ME" ? "text-green-600" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setView("OVERDUE")}
          className={`bg-white rounded-xl p-5 shadow-sm border cursor-pointer transition-all ${
            view === "OVERDUE" 
              ? "border-red-500 ring-2 ring-red-200 shadow-md" 
              : "border-gray-100 hover:shadow-md hover:border-red-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Overdue</p>
              <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              view === "OVERDUE" ? "bg-red-100" : "bg-gray-100"
            }`}>
              <svg className={`w-6 h-6 ${view === "OVERDUE" ? "text-red-600" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown Cards - Compact */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 md:p-4 border border-blue-200">
          <p className="text-xs font-medium text-blue-700">📋 To Do</p>
          <p className="text-lg md:text-2xl font-bold text-blue-900 mt-0.5">{stats.todo}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-2 md:p-4 border border-orange-200">
          <p className="text-xs font-medium text-orange-700">⚡ In Progress</p>
          <p className="text-lg md:text-2xl font-bold text-orange-900 mt-0.5">{stats.inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 md:p-4 border border-green-200">
          <p className="text-xs font-medium text-green-700">✅ Completed</p>
          <p className="text-lg md:text-2xl font-bold text-green-900 mt-0.5">{stats.completed}</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-3 md:px-5 py-2.5 md:py-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 md:gap-2 group"
          >
            <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
            <h3 className="text-sm md:text-base font-semibold text-gray-900">Filters</h3>
            <svg 
              className={`w-3 h-3 md:w-4 md:h-4 text-gray-400 transition-transform ${showFilters ? "rotate-180" : ""}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {(status || priority || showOverdue) && (
              <span className="ml-0.5 md:ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                {[status, priority, showOverdue].filter(Boolean).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            <span className="hidden sm:inline">Due date</span>
            <span className="sm:hidden">Sort</span>
            <svg 
              className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform ${sort === "desc" ? "rotate-180" : ""}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>

        {showFilters && (
          <div className="px-3 md:px-5 pb-2.5 md:pb-4 pt-0 border-t border-gray-100">
            <div className="pt-2.5 md:pt-3 space-y-2 md:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                <div className="relative flex-1 sm:flex-initial">
                  <select
                    value={status || ""}
                    onChange={(e) => setStatus(e.target.value || undefined)}
                    className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="TODO">📋 To Do</option>
                    <option value="IN_PROGRESS">⚡ In Progress</option>
                    <option value="REVIEW">👀 Review</option>
                    <option value="COMPLETED">✅ Completed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="relative flex-1 sm:flex-initial">
                  <select
                    value={priority || ""}
                    onChange={(e) => setPriority(e.target.value || undefined)}
                    className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                  >
                    <option value="">All Priority</option>
                    <option value="LOW">🟢 Low</option>
                    <option value="MEDIUM">🟡 Medium</option>
                    <option value="HIGH">🟠 High</option>
                    <option value="URGENT">🔴 Urgent</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                <label className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs md:text-sm font-medium text-red-700 cursor-pointer hover:bg-red-100 transition">
                  <input
                    type="checkbox"
                    checked={showOverdue}
                    onChange={(e) => setShowOverdue(e.target.checked)}
                    className="w-3.5 h-3.5 md:w-4 md:h-4 accent-red-500 rounded cursor-pointer"
                  />
                  ⏰ Overdue only
                </label>

                {(status || priority || showOverdue) && (
                  <button
                    onClick={() => {
                      setStatus(undefined);
                      setPriority(undefined);
                      setShowOverdue(false);
                    }}
                    className="px-3 py-2 text-xs md:text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition w-full sm:w-auto"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => <TaskSkeleton key={i} />)}

        {!isLoading &&
          filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)}

        {!isLoading && filteredTasks.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-8 md:py-16 px-4">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2 md:mb-4">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-1">No tasks found</h3>
            <p className="text-xs md:text-base text-gray-500 text-center max-w-sm">
              {status || priority || showOverdue
                ? "Try adjusting your filters to see more results"
                : "Get started by creating your first task"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}