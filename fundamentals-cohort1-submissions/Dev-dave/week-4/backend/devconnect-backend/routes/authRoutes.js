import express from "express";
import { register, login, logout, refreshToken } from "../controllers/authControllers.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

router.post("/register", sanitizeInput, register); // Register new user (with input sanitization)
router.post("/login", sanitizeInput, login); // Login existing user (with input sanitization)
router.post("/refresh", refreshToken); //  Refresh access token using refresh token
router.post("/logout", logout); //Logout user and blacklist token

export default router;
