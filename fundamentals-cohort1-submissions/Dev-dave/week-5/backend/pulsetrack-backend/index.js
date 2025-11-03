import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes.js";
import activitiesRoutes from "./routes/activitiesRoutes.js";
import appointmentsRoutes from "./routes/appointmentsRoutes.js";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(errorHandler);
app.use(cors( { origin: " http://localhost:5173", credentials: true } ));



app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/doctors", doctorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



