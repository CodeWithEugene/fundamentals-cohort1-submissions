import mongoose from "mongoose"

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["Running", "Walking", "Cycling", "Swimming", "Gym", "Yoga", "Other"],
    required: true,
  },
  duration: {
    type: Number,
    required: true, // in minutes
  },
  calories: Number,
  distance: Number, // in km
  intensity: {
    type: String,
    enum: ["Low", "Medium", "High"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Activity", activitySchema)
