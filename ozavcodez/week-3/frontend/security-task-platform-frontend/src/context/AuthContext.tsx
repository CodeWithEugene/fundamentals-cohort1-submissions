"use client"

import type React from "react"
import { createContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "@/services/authService"
import { tokenService } from "@/services/tokenService"
import { User } from "@/services/type"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, role: "user" | "admin") => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenService.getAccessToken()
      const storedUser = tokenService.getUser()

      if (accessToken && storedUser) {
        // Verify token is still valid by fetching user profile
        try {
          const response = await authService.getProfile()
          setUser(response.user)
        } catch (error) {
          // Token invalid, clear everything
          tokenService.clearTokens()
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    setUser(response.user)
  }

  const register = async (username: string, email: string, password: string, role: "user" | "admin") => {
    const response = await authService.register({ username, email, password, confirmPassword: password, role })
    setUser(response.user)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}