const API_BASE_URL = "http://localhost:5000/api"

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Users API
export const usersApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  },
  create: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error("Failed to create user")
    return response.json()
  },
  update: async (id: string, userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error("Failed to update user")
    return response.json()
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete user")
    return response.json()
  },
}

// Activities API
export const activitiesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/activities`)
    if (!response.ok) throw new Error("Failed to fetch activities")
    return response.json()
  },
  create: async (activityData: any) => {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activityData),
    })
    if (!response.ok) throw new Error("Failed to create activity")
    return response.json()
  },
  update: async (id: string, activityData: any) => {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activityData),
    })
    if (!response.ok) throw new Error("Failed to update activity")
    return response.json()
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete activity")
    return response.json()
  },
}

// Meals API
export const mealsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/meals`)
    if (!response.ok) throw new Error("Failed to fetch meals")
    return response.json()
  },
  create: async (mealData: any) => {
    const response = await fetch(`${API_BASE_URL}/meals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mealData),
    })
    if (!response.ok) throw new Error("Failed to create meal")
    return response.json()
  },
  update: async (id: string, mealData: any) => {
    const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mealData),
    })
    if (!response.ok) throw new Error("Failed to update meal")
    return response.json()
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete meal")
    return response.json()
  },
}

// Doctors API
export const doctorsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/doctors`)
    if (!response.ok) throw new Error("Failed to fetch doctors")
    return response.json()
  },
  create: async (doctorData: any) => {
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctorData),
    })
    if (!response.ok) throw new Error("Failed to create doctor")
    return response.json()
  },
}

// Appointments API
export const appointmentsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments`)
    if (!response.ok) throw new Error("Failed to fetch appointments")
    return response.json()
  },
  create: async (appointmentData: any) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentData),
    })
    if (!response.ok) throw new Error("Failed to create appointment")
    return response.json()
  },
  update: async (id: string, appointmentData: any) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentData),
    })
    if (!response.ok) throw new Error("Failed to update appointment")
    return response.json()
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete appointment")
    return response.json()
  },
}

// Reports API
export const reportsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/reports`)
    if (!response.ok) throw new Error("Failed to fetch reports")
    return response.json()
  },
  create: async (reportData: any) => {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData),
    })
    if (!response.ok) throw new Error("Failed to create report")
    return response.json()
  },
}
