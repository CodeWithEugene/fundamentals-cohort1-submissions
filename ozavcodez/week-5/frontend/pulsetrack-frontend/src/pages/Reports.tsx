import type React from "react"

import { useState, useEffect } from "react"
import { reportsApi, usersApi } from "../services/api"
import "./Reports.css"

interface User {
  _id: string
  name: string
}

interface Report {
  _id: string
  user: string
  type: string
  title: string
  content: string
  generatedDate: string
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ user: "", type: "", title: "", content: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [reportsRes, usersRes] = await Promise.all([reportsApi.getAll(), usersApi.getAll()])
      setReports(reportsRes.data || [])
      setUsers(usersRes.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.user && formData.type && formData.title && formData.content) {
      try {
        const response = await reportsApi.create({
          user: formData.user,
          type: formData.type,
          title: formData.title,
          content: formData.content,
          generatedDate: new Date().toISOString(),
        })
        setReports([...reports, response.data])
        setFormData({ user: "", type: "", title: "", content: "" })
        setShowForm(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create report")
      }
    }
  }

  const getUserName = (userId: string) => {
    return users.find((u) => u._id === userId)?.name || "Unknown User"
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Health Reports</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Generate Report"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleAddReport} className="report-form">
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
              <label>Report Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="">Select type</option>
                <option value="Health Summary">Health Summary</option>
                <option value="Activity Report">Activity Report</option>
                <option value="Nutrition Report">Nutrition Report</option>
                <option value="Medical Report">Medical Report</option>
              </select>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Report title"
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Report content"
                rows={5}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Report
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading reports...</div>
      ) : (
        <div className="reports-container">
          <div className="reports-list">
            {reports.map((report) => (
              <div
                key={report._id}
                className={`report-item ${selectedReport?._id === report._id ? "active" : ""}`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="report-header">
                  <h3>{report.type}</h3>
                  <span className="report-date">{new Date(report.generatedDate).toLocaleDateString()}</span>
                </div>
                <p className="report-user">{getUserName(report.user)}</p>
                <p className="report-preview">{report.content.substring(0, 60)}...</p>
              </div>
            ))}
          </div>

          <div className="report-detail">
            {selectedReport ? (
              <>
                <div className="detail-header">
                  <h2>{selectedReport.title}</h2>
                  <p className="detail-user">{getUserName(selectedReport.user)}</p>
                  <span className="detail-date">{new Date(selectedReport.generatedDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-content">
                  <div className="detail-section">
                    <h3>Report Content</h3>
                    <p>{selectedReport.content}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <p>Select a report to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
