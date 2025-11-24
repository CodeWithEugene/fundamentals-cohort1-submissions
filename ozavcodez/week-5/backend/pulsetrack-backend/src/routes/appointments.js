import express from "express"
import Appointment from "../models/Appointment.js"
import User from "../models/User.js"
import Doctor from "../models/Doctor.js"
import { validateAppointment, handleValidationErrors } from "../middleware/validation.js"

const router = express.Router()

// Create appointment
router.post("/", validateAppointment, handleValidationErrors, async (req, res, next) => {
  try {
    const { user, doctor, date, time, reason, status, notes } = req.body

    const userExists = await User.findById(user)
    const doctorExists = await Doctor.findById(doctor)

    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    if (!doctorExists) {
      return res.status(404).json({ success: false, message: "Doctor not found" })
    }

    const appointment = new Appointment({
      user,
      doctor,
      date,
      time,
      reason,
      status,
      notes,
    })

    await appointment.save()
    await User.findByIdAndUpdate(user, { $push: { appointments: appointment._id } })
    await Doctor.findByIdAndUpdate(doctor, { $push: { appointments: appointment._id } })

    res.status(201).json({ success: true, data: appointment })
  } catch (error) {
    next(error)
  }
})

// Get all appointments
router.get("/", async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "name email")
      .populate("doctor", "name specialization")
    res.json({ success: true, data: appointments })
  } catch (error) {
    next(error)
  }
})

// Get appointments by user
router.get("/user/:userId", async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.params.userId }).populate(
      "doctor",
      "name specialization hospital",
    )
    res.json({ success: true, data: appointments })
  } catch (error) {
    next(error)
  }
})

// Get appointment by ID
router.get("/:id", async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("user", "name email")
      .populate("doctor", "name specialization")
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" })
    }
    res.json({ success: true, data: appointment })
  } catch (error) {
    next(error)
  }
})

// Update appointment
router.put("/:id", async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" })
    }
    res.json({ success: true, data: appointment })
  } catch (error) {
    next(error)
  }
})

// Delete appointment
router.delete("/:id", async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" })
    }
    await User.findByIdAndUpdate(appointment.user, { $pull: { appointments: appointment._id } })
    await Doctor.findByIdAndUpdate(appointment.doctor, { $pull: { appointments: appointment._id } })
    res.json({ success: true, message: "Appointment deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router
