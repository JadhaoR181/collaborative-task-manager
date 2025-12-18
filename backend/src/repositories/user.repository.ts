import prisma from "../utils/prisma";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, createdAt: true }
  });
};

export const updateUserProfile = (id: string, name: string) => {
  return prisma.user.update({
    where: { id },
    data: { name },
    select: { id: true, name: true, email: true }
  });
};

export const createUser = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return prisma.user.create({ data });
};

export const findAllUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
    }
  });
};

export const userDebug = async () => {
  const users = await prisma.user.findMany();
  return { count: users.length };
};