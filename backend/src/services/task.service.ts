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

  const tasks = await getTasksForUser(userId, filters);
  return tasks.map(task => ({
    ...task,
    isOverdue: isTaskOverdue(task),
    isDueToday: isTaskDueToday(task)
  }));
};

export const updateTask = async (
  taskId: string,
  userId: string,
  payload: any
) => {
  const task = await getTaskById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  // 🔒 Only assignee can update STATUS
  if (payload.status && task.assignedToId !== userId) {
    throw new ApiError(403, "Only assignee can update task status");
  }
  if (payload.status === "COMPLETED") {
  payload.completedAt = new Date();
  payload.overdueNotified = false; // reset
}

if (payload.dueDate) {
  payload.overdueNotified = false;
}


  const updatedTask = await updateTaskById(taskId, payload);

  // 🔔 Notify creator when task is completed
  if (
    payload.status === "COMPLETED" &&
    task.creatorId !== task.assignedToId
  ) {
    const message = `✅ Task "${task.title}" was completed`;

    await createNotification(task.creatorId, message);

    io.to(task.creatorId).emit("task:completed", {
      task: updatedTask,
      message
    });
  }

  // 🔁 Sync updates to creator & assignee
  io.to(task.creatorId).emit("task:updated", updatedTask);

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


const isTaskOverdue = (task: any) => {
  if (!task.dueDate) return false;
  if (task.status === "COMPLETED") return false;

  return new Date(task.dueDate) < new Date();
};

const isTaskDueToday = (task: any) => {
  if (!task.dueDate) return false;

  const today = new Date();
  const due = new Date(task.dueDate);

  return (
    due.getDate() === today.getDate() &&
    due.getMonth() === today.getMonth() &&
    due.getFullYear() === today.getFullYear()
  );
};
