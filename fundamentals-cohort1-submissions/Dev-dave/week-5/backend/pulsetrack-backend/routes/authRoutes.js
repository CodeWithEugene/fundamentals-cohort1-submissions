import express from "express";
import { register, login, logout, refreshToken } from "../controllers/authController.js";
import { sanitizeInput } from "../middlewares/sanitize.js";

const router = express.Router();

router.post("/register", sanitizeInput, register); 
router.post("/login", sanitizeInput, login);
router.post("/refresh", refreshToken); 
router.post("/logout", logout); 
export default router;
