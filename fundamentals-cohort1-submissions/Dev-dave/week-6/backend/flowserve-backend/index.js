import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import prisma from "./config/db.js";
import { limiter } from "./middlewares/rateLimiter.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";


dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);
app.use(cors( { origin: " http://localhost:5173", credentials: true } ));

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});