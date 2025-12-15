import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createTaskHandler,
  deleteTaskHandler,
  getTasksHandler,
  updateTaskHandler
} from "../controllers/task.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createTaskHandler);
router.get("/", getTasksHandler);
router.put("/:id", updateTaskHandler);
router.delete("/:id", deleteTaskHandler);

export default router;
