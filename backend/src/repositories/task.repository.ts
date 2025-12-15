import prisma from "../utils/prisma";

export const createTask = (data: any) => {
  return prisma.task.create({ data });
};

export const getTaskById = (id: string) => {
  return prisma.task.findUnique({ where: { id } });
};

export const updateTaskById = (id: string, data: any) => {
  return prisma.task.update({
    where: { id },
    data
  });
};

export const deleteTaskById = (id: string) => {
  return prisma.task.delete({
    where: { id }
  });
};


export const getTasksForUser = (userId: string, filters: any) => {
  return prisma.task.findMany({
    where: {
      OR: [
        { creatorId: userId },
        { assignedToId: userId }
      ],
      ...filters
    },
    orderBy: { dueDate: "asc" }
  });
};
