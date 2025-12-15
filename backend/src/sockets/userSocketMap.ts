import { Socket } from "socket.io";

const userSocketMap = new Map<string, string>();

export const addUserSocket = (userId: string, socketId: string) => {
  userSocketMap.set(userId, socketId);
};

export const removeUserSocket = (userId: string) => {
  userSocketMap.delete(userId);
};

export const getUserSocket = (userId: string) => {
  return userSocketMap.get(userId);
};
