"use client"

import { useState, useEffect } from "react"
import { activitiesApi, appointmentsApi } from "../services/api"
import "./Dashboard.css"

interface HealthMetric {
  label: string
  value: string
  unit: string
  icon: string
  trend: "up" | "down" | "stable"
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [activitiesRes, appointmentsRes] = await Promise.all([activitiesApi.getAll(), appointmentsApi.getAll()])

      const activities = activitiesRes.data || []
      const appointments = appointmentsRes.data || []

      // Calculate metrics from activities
      const totalCalories = activities.reduce((sum: number, a: any) => sum + (a.calories || 0), 0)
      const avgDuration =
        activities.length > 0
          ? Math.round(activities.reduce((sum: number, a: any) => sum + (a.duration || 0), 0) / activities.length)
          : 0

      setMetrics([
        { label: "Heart Rate", value: "72", unit: "bpm", icon: "❤️", trend: "stable" },
        { label: "Total Activities", value: String(activities.length), unit: "count", icon: "🏃", trend: "up" },
        { label: "Calories Burned", value: String(totalCalories), unit: "kcal", icon: "🔥", trend: "up" },
        { label: "Avg Duration", value: String(avgDuration), unit: "min", icon: "⏱️", trend: "stable" },
      ])

      setRecentActivities(activities.slice(0, 3))
      setUpcomingAppointments(appointments.slice(0, 3))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Health Dashboard</h1>
        <p>Welcome back! Here's your health overview for today.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="metrics-grid">
            {metrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-icon">{metric.icon}</div>
                <div className="metric-content">
                  <p className="metric-label">{metric.label}</p>
                  <div className="metric-value">
                    <span className="value">{metric.value}</span>
                    <span className="unit">{metric.unit}</span>
                  </div>
                  <div className={`metric-trend trend-${metric.trend}`}>
                    {metric.trend === "up" && "↑ Increasing"}
                    {metric.trend === "down" && "↓ Decreasing"}
                    {metric.trend === "stable" && "→ Stable"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-sections">
            <div className="section">
              <h2>Recent Activities</h2>
              <div className="activity-list">
                {recentActivities.map((activity) => (
                  <div key={activity._id} className="activity-item">
                    <span className="activity-icon">🏃</span>
                    <div className="activity-details">
                      <p className="activity-name">{activity.type}</p>
                      <p className="activity-time">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                    <span className="activity-duration">{activity.duration} min</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>Upcoming Appointments</h2>
              <div className="appointment-list">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-item">
                    <div className="appointment-date">
                      <span className="date-day">{new Date(appointment.date).getDate()}</span>
                      <span className="date-month">
                        {new Date(appointment.date).toLocaleString("default", { month: "short" })}
                      </span>
                    </div>
                    <div className="appointment-details">
                      <p className="appointment-doctor">Doctor ID: {appointment.doctorId}</p>
                      <p className="appointment-type">{appointment.status}</p>
                    </div>
                    <span className="appointment-time">{appointment.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
