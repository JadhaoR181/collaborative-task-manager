import { ApiError } from "../utils/apiError";
import {
  createTask,
  deleteTaskById,
  getTaskById,
  getTasksForUser,
  updateTaskById
} from "../repositories/task.repository";

export const createNewTask = async (
  creatorId: string,
  payload: any
) => {
  return createTask({
    ...payload,
    creatorId,
    dueDate: new Date(payload.dueDate)
  });
};

export const getUserTasks = async (
  userId: string,
  query: any
) => {
  const filters: any = {};

  if (query.status) filters.status = query.status;
  if (query.priority) filters.priority = query.priority;

  return getTasksForUser(userId, filters);
};

export const updateTask = async (
  taskId: string,
  userId: string,
  payload: any
) => {
  const task = await getTaskById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  // Creator can update everything
  if (task.creatorId !== userId && task.assignedToId !== userId) {
    throw new ApiError(403, "Not allowed to update this task");
  }

  return updateTaskById(taskId, payload);
};

export const deleteTask = async (
  taskId: string,
  userId: string
) => {
  const task = await getTaskById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  if (task.creatorId !== userId) {
    throw new ApiError(403, "Only creator can delete task");
  }

  return deleteTaskById(taskId);
};
