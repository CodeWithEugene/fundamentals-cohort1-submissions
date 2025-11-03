import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: String,
        duration: Number, // in minutes
        caloriesBurned: Number,
        date: { type: Date, default: Date.now },
    }, 
    { timestamps: true }
);

    export default mongoose.model("Activity", activitySchema);