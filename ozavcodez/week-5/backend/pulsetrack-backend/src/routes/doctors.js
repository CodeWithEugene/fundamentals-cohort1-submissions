import express from "express"
import Doctor from "../models/Doctor.js"
import { validateDoctor, handleValidationErrors } from "../middleware/validation.js"

const router = express.Router()

// Create doctor
router.post("/", validateDoctor, handleValidationErrors, async (req, res, next) => {
  try {
    const { name, specialization, email, phone, hospital, address, qualifications, experience } = req.body

    const doctor = new Doctor({
      name,
      specialization,
      email,
      phone,
      hospital,
      address,
      qualifications,
      experience,
    })

    await doctor.save()
    res.status(201).json({ success: true, data: doctor })
  } catch (error) {
    next(error)
  }
})

// Get all doctors
router.get("/", async (req, res, next) => {
  try {
    const doctors = await Doctor.find()
    res.json({ success: true, data: doctors })
  } catch (error) {
    next(error)
  }
})

// Get doctor by ID
router.get("/:id", async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("appointments")
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" })
    }
    res.json({ success: true, data: doctor })
  } catch (error) {
    next(error)
  }
})

// Update doctor
router.put("/:id", async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" })
    }
    res.json({ success: true, data: doctor })
  } catch (error) {
    next(error)
  }
})

// Delete doctor
router.delete("/:id", async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id)
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" })
    }
    res.json({ success: true, message: "Doctor deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router
