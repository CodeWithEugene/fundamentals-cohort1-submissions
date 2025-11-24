import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import { errorHandler } from "./src/middleware/errorHandler.js"
import userRoutes from "./src/routes/users.js"
import activityRoutes from "./src/routes/activities.js"
import mealRoutes from "./src/routes/meals.js"
import doctorRoutes from "./src/routes/doctors.js"
import appointmentRoutes from "./src/routes/appointments.js"
import reportRoutes from "./src/routes/reports.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pulsetrack")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/activities", activityRoutes)
app.use("/api/meals", mealRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/reports", reportRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
