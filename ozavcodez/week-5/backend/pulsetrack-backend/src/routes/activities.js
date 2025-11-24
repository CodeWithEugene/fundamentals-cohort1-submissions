import express from "express"
import Activity from "../models/Activity.js"
import User from "../models/User.js"
import { validateActivity, handleValidationErrors } from "../middleware/validation.js"

const router = express.Router()

// Create activity
router.post("/", validateActivity, handleValidationErrors, async (req, res, next) => {
  try {
    const { user, type, duration, calories, distance, intensity, date, notes } = req.body

    const userExists = await User.findById(user)
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const activity = new Activity({
      user,
      type,
      duration,
      calories,
      distance,
      intensity,
      date,
      notes,
    })

    await activity.save()
    await User.findByIdAndUpdate(user, { $push: { activities: activity._id } })

    res.status(201).json({ success: true, data: activity })
  } catch (error) {
    next(error)
  }
})

// Get all activities
router.get("/", async (req, res, next) => {
  try {
    const activities = await Activity.find().populate("user", "name email")
    res.json({ success: true, data: activities })
  } catch (error) {
    next(error)
  }
})

// Get activities by user
router.get("/user/:userId", async (req, res, next) => {
  try {
    const activities = await Activity.find({ user: req.params.userId })
    res.json({ success: true, data: activities })
  } catch (error) {
    next(error)
  }
})

// Get activity by ID
router.get("/:id", async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id).populate("user", "name email")
    if (!activity) {
      return res.status(404).json({ success: false, message: "Activity not found" })
    }
    res.json({ success: true, data: activity })
  } catch (error) {
    next(error)
  }
})

// Update activity
router.put("/:id", async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!activity) {
      return res.status(404).json({ success: false, message: "Activity not found" })
    }
    res.json({ success: true, data: activity })
  } catch (error) {
    next(error)
  }
})

// Delete activity
router.delete("/:id", async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id)
    if (!activity) {
      return res.status(404).json({ success: false, message: "Activity not found" })
    }
    await User.findByIdAndUpdate(activity.user, { $pull: { activities: activity._id } })
    res.json({ success: true, message: "Activity deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router
