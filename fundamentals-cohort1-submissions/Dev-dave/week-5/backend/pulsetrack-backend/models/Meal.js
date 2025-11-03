import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
   {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    calories: Number,
    date: { type: Date, default: Date.now },
   },
   { timestamps: true }
);

export default mongoose.model("Meal", mealSchema);
    