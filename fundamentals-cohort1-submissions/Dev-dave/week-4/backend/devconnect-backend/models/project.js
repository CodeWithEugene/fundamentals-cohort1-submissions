import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
      title: { type: String, required: true},
      description: { type: String, required: true},
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    },
    { timestamps: true }
);

export default  mongoose.model("Project", projectSchema);