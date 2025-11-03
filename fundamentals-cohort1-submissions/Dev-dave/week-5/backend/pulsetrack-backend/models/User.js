import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true },
        password: { type: String, required: true },
        failedAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date, default: null },
    }, 
     { timestamps: true } 
);

export default mongoose.model("User", userSchema);