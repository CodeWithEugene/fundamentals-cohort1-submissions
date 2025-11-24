import type React from "react"
import { useState, useEffect } from "react"
import { usersApi } from "../services/api"
import "./Users.css"

interface User {
  _id: string
  name: string
  email: string
  age?: number
  gender?: string
  height?: number
  weight?: number
  medicalHistory?: string
  createdAt: string
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    medicalHistory: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await usersApi.getAll()
      setUsers(response.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.password) {
      try {
        const userData: any = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
        if (formData.age) userData.age = Number.parseInt(formData.age)
        if (formData.gender) userData.gender = formData.gender
        if (formData.height) userData.height = Number.parseInt(formData.height)
        if (formData.weight) userData.weight = Number.parseInt(formData.weight)
        if (formData.medicalHistory) userData.medicalHistory = formData.medicalHistory

        const response = await usersApi.create(userData)
        setUsers([...users, response.data])
        setFormData({
          name: "",
          email: "",
          password: "",
          age: "",
          gender: "",
          height: "",
          weight: "",
          medicalHistory: "",
        })
        setShowForm(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create user")
      }
    } else {
      setError("Please fill in name, email, and password")
    }
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add User"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleAddUser} className="user-form">
            {/* Required Fields */}
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email address"
                required
              />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                required
              />
            </div>

            {/* Optional Health Fields */}
            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Age"
                  min="0"
                  max="150"
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="Height in cm"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="Weight in kg"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Medical History</label>
              <textarea
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                placeholder="Any relevant medical history"
                rows={3}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save User
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Height (cm)</th>
                <th>Weight (kg)</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.age || "-"}</td>
                  <td>{user.gender || "-"}</td>
                  <td>{user.height || "-"}</td>
                  <td>{user.weight || "-"}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
