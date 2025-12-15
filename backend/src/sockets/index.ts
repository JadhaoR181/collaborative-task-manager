import { Server } from "socket.io";

export const setupSockets = (io: Server) => {
  io.on("connection", socket => {
    try {
      const { userId } = socket.handshake.auth;

      if (!userId) {
        console.log("Socket connected without userId");
        return;
      }

      socket.join(userId);
      console.log(`✅ User ${userId} joined room`);

      socket.on("disconnect", () => {
        console.log(`❌ Socket disconnected for user ${userId}`);
      });
    } catch (err) {
      console.error("Socket connection error:", err);
    }
  });
};
