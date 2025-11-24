// Token management with TypeScript

interface TokenStorage {
  accessToken: string | null
  refreshToken: string | null
}

// In-memory storage for access token (most secure)
const tokenStorage: TokenStorage = {
  accessToken: null,
  refreshToken: null,
}

export const tokenService = {
  // Get access token from memory
  getAccessToken(): string | null {
    return tokenStorage.accessToken
  },

  // Get refresh token from sessionStorage
  getRefreshToken(): string | null {
    if (tokenStorage.refreshToken) {
      return tokenStorage.refreshToken
    }
    // Fallback to sessionStorage
    return sessionStorage.getItem("refreshToken")
  },

  // Save tokens
  setTokens(accessToken: string, refreshToken: string): void {
    tokenStorage.accessToken = accessToken
    tokenStorage.refreshToken = refreshToken
    // Store refresh token in sessionStorage as backup
    sessionStorage.setItem("refreshToken", refreshToken)
  },

  // Update only access token (used during refresh)
  setAccessToken(accessToken: string): void {
    tokenStorage.accessToken = accessToken
  },

  // Save user data to sessionStorage
  setUser(user: any): void {
    sessionStorage.setItem("user", JSON.stringify(user))
  },

  // Get user data from sessionStorage
  getUser(): any | null {
    const user = sessionStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  // Clear user data
  clearUser(): void {
    sessionStorage.removeItem("user")
  },

  // Clear all tokens (logout)
  clearTokens(): void {
    tokenStorage.accessToken = null
    tokenStorage.refreshToken = null
    sessionStorage.removeItem("refreshToken")
    this.clearUser() // Also clear user data
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  },
}