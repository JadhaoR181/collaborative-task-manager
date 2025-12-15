import prisma from "../utils/prisma";

export const createNotification = (userId: string, message: string) => {
  return prisma.notification.create({
    data: { userId, message }
  });
};
