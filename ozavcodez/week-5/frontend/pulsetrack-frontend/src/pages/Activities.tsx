import type React from "react"
import { useState, useEffect } from "react"
import { activitiesApi, usersApi } from "../services/api"
import "./Activities.css"

interface User {
  _id: string
  name: string
}

interface Activity {
  _id: string
  user: string
  type: string
  duration: number
  calories: number
  date: string
  distance?: number
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ user: "", type: "", duration: "", calories: "", distance: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [activitiesRes, usersRes] = await Promise.all([activitiesApi.getAll(), usersApi.getAll()])
      setActivities(activitiesRes.data || [])
      setUsers(usersRes.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.user && formData.type && formData.duration && formData.calories) {
      try {
        const response = await activitiesApi.create({
          user: formData.user,
          type: formData.type,
          duration: Number.parseInt(formData.duration),
          calories: Number.parseInt(formData.calories),
          distance: formData.distance ? Number.parseFloat(formData.distance) : undefined,
          date: new Date().toISOString().split("T")[0],
        })
        setActivities([...activities, response.data])
        setFormData({ user: "", type: "", duration: "", calories: "", distance: "" })
        setShowForm(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create activity")
      }
    }
  }

  const getUserName = (userId: string) => {
    return users.find((u) => u._id === userId)?.name || "Unknown User"
  }

  return (
    <div className="activities-page">
      <div className="page-header">
        <h1>Activities Tracking</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Log Activity"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleAddActivity} className="activity-form">
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
              <label>Activity Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="">Select activity</option>
                <option value="Running">Running</option>
                <option value="Cycling">Cycling</option>
                <option value="Swimming">Swimming</option>
                <option value="Walking">Walking</option>
                <option value="Gym">Gym</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Duration"
              />
            </div>
            <div className="form-group">
              <label>Calories Burned</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                placeholder="Calories"
              />
            </div>
            <div className="form-group">
              <label>Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="Distance (optional)"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Log Activity
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading activities...</div>
      ) : (
        <div className="activities-grid">
          {activities.map((activity) => (
            <div key={activity._id} className="activity-card">
              <div className="activity-header">
                <h3>{activity.type}</h3>
                <span className="activity-user">{getUserName(activity.user)}</span>
                <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
              </div>
              <div className="activity-stats">
                <div className="stat">
                  <span className="stat-label">Duration</span>
                  <span className="stat-value">{activity.duration} min</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Calories</span>
                  <span className="stat-value">{activity.calories} kcal</span>
                </div>
                {activity.distance && (
                  <div className="stat">
                    <span className="stat-label">Distance</span>
                    <span className="stat-value">{activity.distance} km</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
