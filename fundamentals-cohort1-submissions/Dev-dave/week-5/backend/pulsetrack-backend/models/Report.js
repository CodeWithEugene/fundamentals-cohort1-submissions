import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reportType: String,
        description: String,
        date: { type: Date, default: Date.now },
    }, 
     { timestamps: true }
);

export default mongoose.model("Report", reportSchema);