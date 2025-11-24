import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: String,
  hospital: String,
  address: String,
  qualifications: [String],
  experience: Number, // in years
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Doctor", doctorSchema)
