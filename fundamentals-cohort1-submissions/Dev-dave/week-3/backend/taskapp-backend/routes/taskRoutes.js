// routes/taskRoutes.js
import express from "express";
import { createTask, getTasks, deleteTask } from "../controllers/taskController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/", authenticate, createTask);         // Create a task
router.get("/", authenticate, getTasks);            // Get tasks
router.delete("/:id", authenticate, deleteTask);    // Delete task (admin only)

export default router;
