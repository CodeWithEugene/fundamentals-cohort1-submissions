import express from "express"
import User from "../models/User.js"
import { validateUser, handleValidationErrors } from "../middleware/validation.js"

const router = express.Router()

// Create user
router.post("/", validateUser, handleValidationErrors, async (req, res, next) => {
  try {
    const { name, email, password, age, gender, height, weight, medicalHistory } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" })
    }

    const user = new User({
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      medicalHistory,
    })

    await user.save()
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
})

// Get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().select("-password")
    res.json({ success: true, data: users })
  } catch (error) {
    next(error)
  }
})

// Get user by ID
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("activities")
      .populate("meals")
      .populate("appointments")
      .populate("reports")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
})

// Update user
router.put("/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
})

// Delete user
router.delete("/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router
