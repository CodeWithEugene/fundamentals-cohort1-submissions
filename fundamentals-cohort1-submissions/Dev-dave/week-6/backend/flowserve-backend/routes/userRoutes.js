import express from "express";
import Joi from "joi";
import { getUsers, createUser } from "../controllers/userController.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

router.get("/", getUsers);
router.post("/", validate(userSchema), createUser);

export default router;
