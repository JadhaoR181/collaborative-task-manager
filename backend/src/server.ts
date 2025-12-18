import http from "http";
import app from "./app";
import { Server } from "socket.io";
import { setupSockets } from "./sockets";
import cron from "node-cron";
import { checkOverdueTasks } from "./services/taskOverdue.service";

const PORT = 5000;

// 1️⃣ Create HTTP server
const server = http.createServer(app);

// 2️⃣ Socket.io (exported for services)
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// 3️⃣ Setup sockets ONLY in runtime
if (process.env.NODE_ENV !== "test") {
  setupSockets(io);

  // Daily cron (disabled in tests)
  cron.schedule("0 9 * * *", async () => {
    console.log("Running overdue task check...");
    await checkOverdueTasks();
  });
}

// 4️⃣ Start server ONLY if not imported by tests
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
