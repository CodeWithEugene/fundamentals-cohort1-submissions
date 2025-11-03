import express from "express";
import { addComment, getCommentsByProject } from "../controllers/commentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:projectId", authenticate, addComment);
router.get("/:projectId", getCommentsByProject);

export default router;