import express from "express"
import Report from "../models/Report.js"
import User from "../models/User.js"
import { validateReport, handleValidationErrors } from "../middleware/validation.js"

const router = express.Router()

// Create report
router.post("/", validateReport, handleValidationErrors, async (req, res, next) => {
  try {
    const { user, type, title, content, period, metrics } = req.body

    const userExists = await User.findById(user)
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const report = new Report({
      user,
      type,
      title,
      content,
      period,
      metrics,
    })

    await report.save()
    await User.findByIdAndUpdate(user, { $push: { reports: report._id } })

    res.status(201).json({ success: true, data: report })
  } catch (error) {
    next(error)
  }
})

// Get all reports
router.get("/", async (req, res, next) => {
  try {
    const reports = await Report.find().populate("user", "name email")
    res.json({ success: true, data: reports })
  } catch (error) {
    next(error)
  }
})

// Get reports by user
router.get("/user/:userId", async (req, res, next) => {
  try {
    const reports = await Report.find({ user: req.params.userId })
    res.json({ success: true, data: reports })
  } catch (error) {
    next(error)
  }
})

// Get report by ID
router.get("/:id", async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate("user", "name email")
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" })
    }
    res.json({ success: true, data: report })
  } catch (error) {
    next(error)
  }
})

// Update report
router.put("/:id", async (req, res, next) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" })
    }
    res.json({ success: true, data: report })
  } catch (error) {
    next(error)
  }
})

// Delete report
router.delete("/:id", async (req, res, next) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id)
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" })
    }
    await User.findByIdAndUpdate(report.user, { $pull: { reports: report._id } })
    res.json({ success: true, message: "Report deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router
