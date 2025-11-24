import api from "./api"
import type { Task, CreateTaskData, UpdateTaskData, TaskFilters, PaginatedResponse } from "./type"

export const taskService = {
  // Get all tasks with optional filters
  async getTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams()

    if (filters?.status) params.append("status", filters.status)
    if (filters?.priority) params.append("priority", filters.priority)
    if (filters?.search) params.append("search", filters.search)
    if (filters?.page) params.append("page", filters.page.toString())
    if (filters?.limit) params.append("limit", filters.limit.toString())

    const response = await api.get<PaginatedResponse<Task>>(`/tasks?${params.toString()}`)
    return response.data
  },

  // Get single task by ID
  async getTaskById(taskId: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${taskId}`)
    return response.data
  },

  // Create new task
  async createTask(taskData: CreateTaskData): Promise<Task> {
    const response = await api.post<Task>("/tasks", taskData)
    return response.data
  },

  // Update existing task
  async updateTask(taskId: string, taskData: UpdateTaskData): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${taskId}`, taskData)
    return response.data
  },

  // Delete task (admin only)
  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`)
  },

  // Get user's own tasks
  async getMyTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams()

    if (filters?.status) params.append("status", filters.status)
    if (filters?.priority) params.append("priority", filters.priority)
    if (filters?.search) params.append("search", filters.search)
    if (filters?.page) params.append("page", filters.page.toString())
    if (filters?.limit) params.append("limit", filters.limit.toString())

    const response = await api.get<PaginatedResponse<Task>>(`/tasks/my?${params.toString()}`)
    return response.data
  },
}