import http from "http";
import app from "./app";
import { Server } from "socket.io";
import { setupSockets } from "./sockets";
import cron from "node-cron";
import { checkOverdueTasks } from "./services/taskOverdue.service";

const PORT = process.env.PORT || 5000;


const server = http.createServer(app);


export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});


if (process.env.NODE_ENV !== "test") {
  setupSockets(io);

  // Daily cron (disabled in tests)
  cron.schedule("0 9 * * *", async () => {
    console.log("Running overdue task check...");
    await checkOverdueTasks();
  });
}

//  Start server ONLY if not imported by tests
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
