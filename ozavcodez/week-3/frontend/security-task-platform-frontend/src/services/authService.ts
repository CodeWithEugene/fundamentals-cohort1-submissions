import api from "./api"
import { tokenService } from "./tokenService"
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from "./type"

export const authService = {
  // Register new user
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", credentials)
    const { accessToken, refreshToken, user } = response.data

    // Save tokens
    tokenService.setTokens(accessToken, refreshToken)
    tokenService.setUser(user)

    return response.data
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials)
    const { accessToken, refreshToken, user } = response.data

    // Save tokens
    tokenService.setTokens(accessToken, refreshToken)
    tokenService.setUser(user)

    return response.data
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      const refreshToken = tokenService.getRefreshToken()
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always clear tokens, even if API call fails
      tokenService.clearTokens()
    }
  },

  // Refresh access token
  async refreshToken(): Promise<string> {
    const refreshToken = tokenService.getRefreshToken()

    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await api.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    })

    const { accessToken, refreshToken: newRefreshToken } = response.data

    // Update tokens
    tokenService.setTokens(accessToken, newRefreshToken)

    return accessToken
  },

  // Get current user profile
  async getProfile(): Promise<{ user: User }> {
    const response = await api.get<User>("/auth/me")
    return { user: response.data }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return tokenService.isAuthenticated()
  },
}