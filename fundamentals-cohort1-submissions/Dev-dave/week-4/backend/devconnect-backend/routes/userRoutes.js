import express from "express";
import { getUserProfile } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticate, getUserProfile);

export default router;
