import express from "express";
import { getDoctors, createDoctor } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", getDoctors);
router.post("/", createDoctor);

export default router;
