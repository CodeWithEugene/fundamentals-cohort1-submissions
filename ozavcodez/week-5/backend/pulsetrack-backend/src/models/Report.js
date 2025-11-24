import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["Health Summary", "Activity Report", "Nutrition Report", "Medical Report"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: String,
  generatedDate: {
    type: Date,
    default: Date.now,
  },
  period: {
    startDate: Date,
    endDate: Date,
  },
  metrics: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Report", reportSchema)
