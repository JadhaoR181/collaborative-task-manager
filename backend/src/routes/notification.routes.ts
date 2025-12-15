import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getMyNotifications, markNotificationsRead } from "../controllers/notification.controller";

const router = Router();

router.get("/", authMiddleware, getMyNotifications);
router.post("/read", authMiddleware, markNotificationsRead);


export default router;
