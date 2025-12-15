import { ApiError } from "../utils/apiError";
import {
  createTask,
  deleteTaskById,
  getTaskById,
  getTasksForUser,
  updateTaskById
} from "../repositories/task.repository";
import { io } from "../server";
import { createNotification } from "../repositories/notification.repository";

export const createNewTask = async (creatorId: string, payload: any) => {
  const task = await createTask({
    ...payload,
    creatorId,
    dueDate: new Date(payload.dueDate)
  });

  if (payload.assignedToId !== creatorId) {
    const message = `You have been assigned a new task: ${task.title}`;

    // 1️⃣ Save notification
    await createNotification(payload.assignedToId, message);

    // 2️⃣ Emit to USER ROOM (not socketId)
    io.to(payload.assignedToId).emit("task:assigned", {
      message,
      task
    });
  }

  return task;
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

  if (task.creatorId !== userId && task.assignedToId !== userId) {
    throw new ApiError(403, "Not allowed");
  }

  const updatedTask = await updateTaskById(taskId, payload);

  // Emit to creator
  io.to(task.creatorId).emit("task:updated", updatedTask);

  // Emit to assignee
  if (task.assignedToId && task.assignedToId !== task.creatorId) {
    io.to(task.assignedToId).emit("task:updated", updatedTask);
  }

  return updatedTask;
};


export const deleteTask = async (taskId: string, userId: string) => {
  const task = await getTaskById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // 🔒 Only creator can delete
  if (task.creatorId !== userId) {
    throw new ApiError(403, "Only creator can delete this task");
  }

  await deleteTaskById(taskId);

  // 🔴 Real-time update
  io.to(task.creatorId).emit("task:deleted", { taskId });

  if (task.assignedToId && task.assignedToId !== task.creatorId) {
    io.to(task.assignedToId).emit("task:deleted", { taskId });
  }

  return { success: true };
};