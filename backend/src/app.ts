import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";
import notificationRoutes from "./routes/notification.routes";
import { errorHandler } from "./middlewares/error.middleware";
import debugRoutes from "./routes/debug.routes";

const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "https://collaborative-task-manager-tau.vercel.app",
      "https://collaborative-task-manager-tau.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.route("/").get((req, res) => {
  res.json({ message: "Collaborative Task Manager API is running!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/debug", debugRoutes);


// ❗ Error handler MUST be last
app.use(errorHandler);

export default app;
