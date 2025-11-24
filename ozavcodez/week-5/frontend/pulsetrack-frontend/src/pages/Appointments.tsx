import type React from "react"
import { useState, useEffect } from "react"
import { appointmentsApi, doctorsApi, usersApi } from "../services/api"
import "./Appointments.css"

interface User {
  _id: string
  name: string
}

interface Appointment {
  _id: string
  user: string
  doctor: string
  date: string
  time: string
  status: "Scheduled" | "Completed" | "Cancelled"
}

interface Doctor {
  _id: string
  name: string
  specialty: string
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ user: "", doctor: "", date: "", time: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [appointmentsRes, doctorsRes, usersRes] = await Promise.all([
        appointmentsApi.getAll(),
        doctorsApi.getAll(),
        usersApi.getAll(),
      ])
      setAppointments(appointmentsRes.data || [])
      setDoctors(doctorsRes.data || [])
      setUsers(usersRes.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.user && formData.doctor && formData.date && formData.time) {
      try {
        const response = await appointmentsApi.create({
          user: formData.user,
          doctor: formData.doctor,
          date: formData.date,
          time: formData.time,
          status: "Scheduled",
        })
        setAppointments([...appointments, response.data])
        setFormData({ user: "", doctor: "", date: "", time: "" })
        setShowForm(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create appointment")
      }
    }
  }

  const getUserName = (userId: string) => {
    return users.find((u) => u._id === userId)?.name || "Unknown User"
  }

  const getDoctorInfo = (doctorId: string) => {
    return doctors.find((d) => d._id === doctorId)
  }

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1>Doctors & Appointments</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Schedule Appointment"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleAddAppointment} className="appointment-form">
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
              <label>Doctor</label>
              <select value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}>
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Schedule
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => {
            const doctor = getDoctorInfo(appointment.doctor)
            return (
              <div key={appointment._id} className="appointment-item">
                <div className="appointment-date-box">
                  <span className="date-day">{new Date(appointment.date).getDate()}</span>
                  <span className="date-month">
                    {new Date(appointment.date).toLocaleString("default", { month: "short" })}
                  </span>
                </div>
                <div className="appointment-details">
                  <h3>{doctor?.name || "Unknown Doctor"}</h3>
                  <p className="specialty">{doctor?.specialty || "N/A"}</p>
                  <p className="user">Patient: {getUserName(appointment.user)}</p>
                  <p className="time">
                    <span>🕐</span> {appointment.time}
                  </p>
                </div>
                <div className={`appointment-status status-${appointment.status.toLowerCase()}`}>
                  {appointment.status}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
