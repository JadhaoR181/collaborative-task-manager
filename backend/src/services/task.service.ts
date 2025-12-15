import { ApiError } from "../utils/apiError";
import {
  createTask,
  deleteTaskById,
  getTaskById,
  getTasksForUser,
  updateTaskById
} from "../repositories/task.repository";
import { io } from "../server";
import { getUserSocket } from "../sockets/userSocketMap";
import { createNotification } from "../repositories/notification.repository";

export const createNewTask = async (creatorId: string, payload: any) => {
  const task = await createTask({
    ...payload,
    creatorId,
    dueDate: new Date(payload.dueDate)
  });

  if (payload.assignedToId !== creatorId) {
    const socketId = getUserSocket(payload.assignedToId);

    const message = `You have been assigned a new task: ${task.title}`;

    await createNotification(payload.assignedToId, message);

    if (socketId) {
      io.to(socketId).emit("task:assigned", {
        message,
        task
      });
    }
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

  //  Emit real-time update
  io.emit("task:updated", updatedTask);

  return updatedTask;
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
