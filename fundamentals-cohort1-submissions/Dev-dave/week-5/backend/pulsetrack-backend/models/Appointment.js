import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
        date: Date,
        reason: String,
        status: { type: String, default: "scheduled" },
    }, 
    { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);