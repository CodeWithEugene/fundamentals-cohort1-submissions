import { body, validationResult } from "express-validator"

export const validateUser = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("age").optional().isInt({ min: 0, max: 150 }).withMessage("Age must be between 0 and 150"),
  body("gender").optional().isIn(["Male", "Female", "Other"]).withMessage("Invalid gender"),
  body("height").optional().isInt({ min: 0 }).withMessage("Height must be a positive number"),
  body("weight").optional().isInt({ min: 0 }).withMessage("Weight must be a positive number"),
]

export const validateActivity = [
  body("user").isMongoId().withMessage("Valid user ID is required"),
  body("type")
    .isIn(["Running", "Walking", "Cycling", "Swimming", "Gym", "Yoga", "Other"])
    .withMessage("Invalid activity type"),
  body("duration").isInt({ min: 1 }).withMessage("Duration must be at least 1 minute"),
  body("calories").optional().isInt({ min: 0 }).withMessage("Calories must be a positive number"),
  body("distance").optional().isFloat({ min: 0 }).withMessage("Distance must be a positive number"),
  body("intensity").optional().isIn(["Low", "Medium", "High"]).withMessage("Invalid intensity level"),
]

export const validateMeal = [
  body("user").isMongoId().withMessage("Valid user ID is required"),
  body("name").trim().notEmpty().withMessage("Meal name is required"),
  body("type").isIn(["Breakfast", "Lunch", "Dinner", "Snack"]).withMessage("Invalid meal type"),
  body("calories").isInt({ min: 0 }).withMessage("Calories must be a positive number"),
  body("protein").optional().isInt({ min: 0 }).withMessage("Protein must be a positive number"),
  body("carbs").optional().isInt({ min: 0 }).withMessage("Carbs must be a positive number"),
  body("fat").optional().isInt({ min: 0 }).withMessage("Fat must be a positive number"),
]

export const validateDoctor = [
  body("name").trim().notEmpty().withMessage("Doctor name is required"),
  body("specialization").trim().notEmpty().withMessage("Specialization is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").optional().isMobilePhone().withMessage("Valid phone number is required"),
  body("experience").optional().isInt({ min: 0 }).withMessage("Experience must be a positive number"),
]

export const validateAppointment = [
  body("user").isMongoId().withMessage("Valid user ID is required"),
  body("doctor").isMongoId().withMessage("Valid doctor ID is required"),
  body("date").isISO8601().withMessage("Valid date is required"),
  body("time")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Valid time format (HH:MM) is required"),
  body("status").optional().isIn(["Scheduled", "Completed", "Cancelled"]).withMessage("Invalid status"),
]

export const validateReport = [
  body("user").isMongoId().withMessage("Valid user ID is required"),
  body("type")
    .isIn(["Health Summary", "Activity Report", "Nutrition Report", "Medical Report"])
    .withMessage("Invalid report type"),
  body("title").trim().notEmpty().withMessage("Report title is required"),
]

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    })
  }
  next()
}
