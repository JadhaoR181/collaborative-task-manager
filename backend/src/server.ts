import http from "http";
import app from "./app";
import { Server } from "socket.io";
import { setupSockets } from "./sockets";
import cron from "node-cron";
import { checkOverdueTasks } from "./services/taskOverdue.service";

const PORT = 5000;

// 1️⃣ Create HTTP server from Express app
const server = http.createServer(app);

// 2️⃣ Attach Socket.io to SAME server
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite frontend
    credentials: true
  }
});

// 3️⃣ Setup socket listeners
setupSockets(io);

// Runs every day at 9 AM
cron.schedule("* * * * *", async () => {
  console.log("Running overdue task check...");
  await checkOverdueTasks();
});

// 4️⃣ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
