import type React from "react"

import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  // Not logged in - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Logged in but not admin - redirect to dashboard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  // All checks passed - render the protected content
  return <>{children}</>
}