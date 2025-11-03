import express from "express";
import Joi from "joi";
import {
  createTransaction,
  getTransactions,
} from "../controllers/transactionController.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

const transactionSchema = Joi.object({
  userId: Joi.number().required(),
  amount: Joi.number().required(),
  type: Joi.string().valid("deposit", "withdraw").required(),
});

router.get("/", getTransactions);
router.post("/", validate(transactionSchema), createTransaction);

export default router;
