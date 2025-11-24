import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from "axios"
import { ApiError, AuthResponse } from "./type"
import { tokenService } from "./tokenService"
// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL:  "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Request interceptor - attach access token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getAccessToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor - handle token refresh automatically
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = tokenService.getRefreshToken()

      if (!refreshToken) {
        // No refresh token, redirect to login
        tokenService.clearTokens()
        window.location.href = "/login"
        return Promise.reject(error)
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post<AuthResponse>(`${api.defaults.baseURL}/auth/refresh`, { refreshToken })

        const { accessToken, refreshToken: newRefreshToken } = response.data

        // Update tokens
        tokenService.setTokens(accessToken, newRefreshToken)

        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        // Process queued requests
        processQueue(null, accessToken)

        // Retry original request
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError as Error, null)
        tokenService.clearTokens()
        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api