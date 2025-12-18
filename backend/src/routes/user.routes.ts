import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getMe, updateMe } from "../controllers/user.controller";
import { getAllUsersHandler } from "../controllers/user.controller";

const router = Router();

router.get("/", authMiddleware, getAllUsersHandler);
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);

export default router;
