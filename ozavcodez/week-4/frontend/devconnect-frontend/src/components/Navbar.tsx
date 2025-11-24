"use client"

import { Link } from "react-router-dom"
import { Code2, LogOut } from "lucide-react"
import { Button } from "./Button"
import { useAuth } from "../hooks/useAuth"

export function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="border-b border-border/50 bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Code2 className="h-6 w-6" />
          <span className="text-xl font-bold">DevConnect</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/projects">
                <Button variant="ghost">Projects</Button>
              </Link>
              <Link to={`/users/${user._id}`}>
                <Button variant="ghost">{user.username}</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button>Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
