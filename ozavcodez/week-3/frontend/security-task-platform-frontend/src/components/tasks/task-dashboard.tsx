"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Plus, LogOut, Search, Filter, Settings } from "lucide-react"
import { TaskList } from "./task-list"
import { CreateTaskDialog } from "./create-task-dialog"
import { SearchFilterDialog } from "./search-filter-dialog"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"



export function TaskDashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }


  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsSearchDialogOpen(false)
  }

  const handleFilter = (status: string) => {
    setFilterStatus(status)
    setIsSearchDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SecureTask</h1>
                <p className="text-xs text-muted-foreground">Task Management Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <p className="text-sm font-medium text-foreground">{user?.username}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {isAdmin} {isAdmin && "• Full Access"}
                </p>
              </div>
              {user?.role === "admin" && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Stats Cards */}
         
          {/* Task Management Section */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Tasks</CardTitle>
                  <CardDescription>Manage and track your tasks</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsSearchDialogOpen(true)} className="gap-2">
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsSearchDialogOpen(true)} className="gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                  <Button size="sm" onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Task</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TaskList userRole={user?.role ?? ""} searchQuery={searchQuery} filterStatus={filterStatus} />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialogs */}
      <CreateTaskDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <SearchFilterDialog
        open={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
    </div>
  )
}
