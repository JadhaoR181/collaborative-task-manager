import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
});

httpServer.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
