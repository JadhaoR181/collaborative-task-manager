import { Router } from "express";
import prisma from "../utils/prisma";

const router = Router();

/**
 * 🔍 DEBUG ROUTE
 * Checks DB connectivity & user count
 * REMOVE after debugging
 */
router.get("/ping-db", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      success: true,
      message: "Database connected successfully",
      userCount: users.length,
      users: users.map(u => ({
        id: u.id,
        email: u.email
      }))
    });
  } catch (error: any) {
    console.error("❌ DB CONNECTION FAILED:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });
  }
});

export default router;
