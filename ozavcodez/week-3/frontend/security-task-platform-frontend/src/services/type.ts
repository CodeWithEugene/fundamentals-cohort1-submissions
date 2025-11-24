
export interface User {
  _id: string
  email: string
  role: "user" | "admin"
  username: string
  createdAt: string
  failedLoginAttempts?: number
  isLocked?: boolean
  lockedUntil?: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  username: string
  role: "user" | "admin"
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface Task {
  _id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskData {
  title: string
  description: string
  status?: "pending" | "in-progress" | "completed"
  priority?: "low" | "medium" | "high"
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: "pending" | "in-progress" | "completed"
  priority?: "low" | "medium" | "high"
}

export interface TaskFilters {
  status?: string
  priority?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiError {
  error: string
  details?: string
}