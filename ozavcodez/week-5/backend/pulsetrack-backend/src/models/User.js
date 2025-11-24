import mongoose from "mongoose"
import bcryptjs from "bcryptjs"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: Number,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  height: Number, // in cm
  weight: Number, // in kg
  medicalHistory: String,
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  meals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
    },
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password)
}

export default mongoose.model("User", userSchema)
