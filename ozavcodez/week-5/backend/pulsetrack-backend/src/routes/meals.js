import express from "express"
import Meal from "../models/Meal.js"
import User from "../models/User.js"
import { validateMeal, handleValidationErrors } from "../middleware/validation.js"

const router = express.Router()

// Create meal
router.post("/", validateMeal, handleValidationErrors, async (req, res, next) => {
  try {
    const { user, name, type, calories, protein, carbs, fat, ingredients, date, notes } = req.body

    const userExists = await User.findById(user)
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const meal = new Meal({
      user,
      name,
      type,
      calories,
      protein,
      carbs,
      fat,
      ingredients,
      date,
      notes,
    })

    await meal.save()
    await User.findByIdAndUpdate(user, { $push: { meals: meal._id } })

    res.status(201).json({ success: true, data: meal })
  } catch (error) {
    next(error)
  }
})

// Get all meals
router.get("/", async (req, res, next) => {
  try {
    const meals = await Meal.find().populate("user", "name email")
    res.json({ success: true, data: meals })
  } catch (error) {
    next(error)
  }
})

// Get meals by user
router.get("/user/:userId", async (req, res, next) => {
  try {
    const meals = await Meal.find({ user: req.params.userId })
    res.json({ success: true, data: meals })
  } catch (error) {
    next(error)
  }
})

// Get meal by ID
router.get("/:id", async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id).populate("user", "name email")
    if (!meal) {
      return res.status(404).json({ success: false, message: "Meal not found" })
    }
    res.json({ success: true, data: meal })
  } catch (error) {
    next(error)
  }
})

// Update meal
router.put("/:id", async (req, res, next) => {
  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!meal) {
      return res.status(404).json({ success: false, message: "Meal not found" })
    }
    res.json({ success: true, data: meal })
  } catch (error) {
    next(error)
  }
})

// Delete meal
router.delete("/:id", async (req, res, next) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id)
    if (!meal) {
      return res.status(404).json({ success: false, message: "Meal not found" })
    }
    await User.findByIdAndUpdate(meal.user, { $pull: { meals: meal._id } })
    res.json({ success: true, message: "Meal deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router
