import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getMe, updateMe, getUsers } from "../controllers/user.controller";

const router = Router();

router.get("/", authMiddleware, getUsers); 
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);

export default router;
