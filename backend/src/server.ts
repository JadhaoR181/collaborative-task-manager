import { createServer } from "http";
import { Server, Socket } from "socket.io";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import { addUserSocket, removeUserSocket } from "./sockets/userSocketMap";

interface JwtPayload {
  id: string;
  email: string;
}

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

io.use((socket: Socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    socket.data.userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;

  addUserSocket(userId, socket.id);

  socket.on("disconnect", () => {
    removeUserSocket(userId);
    console.log(`❌ User disconnected: ${userId}`);
  });
});

httpServer.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
