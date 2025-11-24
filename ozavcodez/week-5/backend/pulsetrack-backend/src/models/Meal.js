import mongoose from "mongoose"

const mealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: Number, // in grams
  carbs: Number, // in grams
  fat: Number, // in grams
  ingredients: [String],
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

export default mongoose.model("Meal", mealSchema)
