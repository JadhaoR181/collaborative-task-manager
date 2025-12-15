import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getMyNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  res.status(200).json(notifications);
};
