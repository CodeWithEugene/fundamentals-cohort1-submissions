
import express from "express";
import { createProject, getProjects, getProjectById, getProjectsByUser,  deleteProject} from "../controllers/projectController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.get("/user/:userId", authenticate, getProjectsByUser);
router.delete("/:id", authenticate, deleteProject);



export default router;

