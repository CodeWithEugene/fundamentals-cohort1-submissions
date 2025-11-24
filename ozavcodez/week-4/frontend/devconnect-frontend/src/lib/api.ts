import axios, { type AxiosInstance } from "axios"

interface AuthResponse {
  token: string
  user: {
    _id: string
    username: string
    email: string
  }
}

export interface Project {
  _id: string
  title: string
  description: string
  author: {
    _id: string
    username: string
  }
  likes: string[]
  comments: string[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  _id: string
  text?: string
   content?: string,
  author: {
    _id: string
    username: string
  }
  projectId: string
  likes: string[]
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  username: string
  email: string
  bio?: string
  location?: string
  skills?: string[]
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "https://devconnect-o.up.railway.app"

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth endpoints
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    apiClient.post<AuthResponse>("/auth/register", data),
  login: (data: { email: string; password: string }) => apiClient.post<AuthResponse>("/auth/login", data),
  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },
}

// Project endpoints
export const projectAPI = {
  getAll: (params?: Record<string, unknown>) => apiClient.get<Project[]>("/projects", { params }),
  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => apiClient.post<Project>("/projects", data),
  update: (id: string, data: Partial<Project>) => apiClient.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
  like: (id: string) => apiClient.post(`/projects/${id}/like`),
  unlike: (id: string) => apiClient.post(`/projects/${id}/unlike`),
  addCollaborator: (id: string, userId: string) => apiClient.post(`/projects/${id}/collaborators`, { userId }),
}

// Comment endpoints
export const commentAPI = {
  getByProject: (projectId: string) => apiClient.get<Comment[]>(`/comments/project/${projectId}`),
  create: (data: { projectId: string; text: string }) => apiClient.post<Comment>("/comments", data),
  update: (id: string, data: Partial<Comment>) => apiClient.put<Comment>(`/comments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/comments/${id}`),
  like: (id: string) => apiClient.post(`/comments/${id}/like`),
  unlike: (id: string) => apiClient.post(`/comments/${id}/unlike`),
}

// User endpoints
export const userAPI = {
  getUserById: (id: string) => apiClient.get<User>(`/users/${id}`),
  getProfile: () => apiClient.get<User>("/users/profile"),
  update: (data: Partial<User>) => apiClient.put<User>("/users/profile", data),
  search: (query: string) => apiClient.get<User[]>("/users/search", { params: { q: query } }),
}

export default apiClient
