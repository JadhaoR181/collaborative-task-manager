 // adjust path if needed
import { io } from "../server";
import { createNotification } from "../repositories/notification.repository";
import {
  createTask,
  deleteTaskById,
  getTaskById,
  getTasksForUser,
  updateTaskById
} from "../repositories/task.repository";
import prisma from "../utils/prisma";

export const checkOverdueTasks = async () => {
  const now = new Date();

  // ✅ Find ONLY tasks that:
  // - are not completed
  // - have a due date in the past
  // - were NOT already notified
  const overdueTasks = await prisma.task.findMany({
    where: {
      status: { not: "COMPLETED" },
      dueDate: { lt: now },
      overdueNotified: false
    },
    include: {
      assignedTo: true,
      creator: true
    }
  });

  for (const task of overdueTasks) {
    const message = `⏰ Task "${task.title}" is overdue`;

    // 🔔 Notify assignee
    if (task.assignedToId) {
      await createNotification(task.assignedToId, message);

      io.to(task.assignedToId).emit("task:overdue", {
        taskId: task.id,
        message
      });
    }

    // 🔔 (Optional but professional) notify creator too
    if (task.creatorId !== task.assignedToId) {
      await createNotification(task.creatorId, message);

      io.to(task.creatorId).emit("task:overdue", {
        taskId: task.id,
        message
      });
    }

    // 🔒 VERY IMPORTANT: mark as notified
    await prisma.task.update({
      where: { id: task.id },
      data: { overdueNotified: true }
    });
  }

  console.log(`✅ Overdue check completed. Notified ${overdueTasks.length} tasks.`);
};
