import prisma from "../utils/prisma";

export const createNotification = (userId: string, message: string) => {
  return prisma.notification.create({
    data: { userId, message }
  });
};

export const markAllAsRead = (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true }
  });
};
