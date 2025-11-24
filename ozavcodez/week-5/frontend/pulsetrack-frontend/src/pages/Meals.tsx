import type React from "react"
import { useState, useEffect } from "react"
import { mealsApi, usersApi } from "../services/api"
import "./Meals.css"

interface User {
  _id: string
  name: string
}

interface Meal {
  _id: string
  user: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  date: string
}

export default function Meals() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ user: "", name: "", calories: "", protein: "", carbs: "", fat: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [mealsRes, usersRes] = await Promise.all([mealsApi.getAll(), usersApi.getAll()])
      setMeals(mealsRes.data || [])
      setUsers(usersRes.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.user && formData.name && formData.calories) {
      try {
        const response = await mealsApi.create({
          user: formData.user,
          name: formData.name,
          calories: Number.parseInt(formData.calories),
          protein: Number.parseInt(formData.protein) || 0,
          carbs: Number.parseInt(formData.carbs) || 0,
          fat: Number.parseInt(formData.fat) || 0,
          date: new Date().toISOString().split("T")[0],
        })
        setMeals([...meals, response.data])
        setFormData({ user: "", name: "", calories: "", protein: "", carbs: "", fat: "" })
        setShowForm(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create meal")
      }
    }
  }

  const getUserName = (userId: string) => {
    return users.find((u) => u._id === userId)?.name || "Unknown User"
  }

  return (
    <div className="meals-page">
      <div className="page-header">
        <h1>Meals Logging</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Log Meal"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleAddMeal} className="meal-form">
            <div className="form-group">
              <label>User</label>
              <select value={formData.user} onChange={(e) => setFormData({ ...formData, user: e.target.value })}>
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Meal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Breakfast - Oatmeal"
              />
            </div>
            <div className="form-group">
              <label>Calories</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                placeholder="Calories"
              />
            </div>
            <div className="form-group">
              <label>Protein (g)</label>
              <input
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                placeholder="Protein"
              />
            </div>
            <div className="form-group">
              <label>Carbs (g)</label>
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                placeholder="Carbs"
              />
            </div>
            <div className="form-group">
              <label>Fat (g)</label>
              <input
                type="number"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                placeholder="Fat"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Log Meal
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading meals...</div>
      ) : (
        <div className="meals-grid">
          {meals.map((meal) => (
            <div key={meal._id} className="meal-card">
              <div className="meal-header">
                <h3>{meal.name}</h3>
                <span className="meal-user">{getUserName(meal.user)}</span>
                <span className="meal-date">{new Date(meal.date).toLocaleDateString()}</span>
              </div>
              <div className="meal-calories">
                <span className="calories-value">{meal.calories}</span>
                <span className="calories-label">kcal</span>
              </div>
              <div className="meal-macros">
                <div className="macro">
                  <span className="macro-label">Protein</span>
                  <span className="macro-value">{meal.protein}g</span>
                </div>
                <div className="macro">
                  <span className="macro-label">Carbs</span>
                  <span className="macro-value">{meal.carbs}g</span>
                </div>
                <div className="macro">
                  <span className="macro-label">Fat</span>
                  <span className="macro-value">{meal.fat}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
