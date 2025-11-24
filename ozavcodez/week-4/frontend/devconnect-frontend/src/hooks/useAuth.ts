"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  _id: string
  username: string
  email: string
}

interface UseAuthReturn {
  user: User | null
  loading: boolean
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user")
  //   if (storedUser) {
  //     try {
  //       setUser(JSON.parse(storedUser))
  //     } catch (err) {
  //       localStorage.removeItem("user")
  //     }
  //   }
  //   setLoading(false)
  // }, [])

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user")
      setUser(storedUser ? JSON.parse(storedUser) : null)
    }
    window.addEventListener("storage", syncUser)
    return () => window.removeEventListener("storage", syncUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }, [])

  return { user, loading, logout }
}
