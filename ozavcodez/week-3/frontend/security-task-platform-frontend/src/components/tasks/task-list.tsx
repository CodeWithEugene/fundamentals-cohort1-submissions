"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Trash2, Clock, CheckCircle2, Circle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { taskService } from "@/services/taskService"

// import Task type from your service/types file for consistency
import type { Task } from "@/services/type"

interface TaskListProps {
  userRole: string
  searchQuery?: string
  filterStatus?: string | null
}

export function TaskList({ userRole, searchQuery = "", filterStatus = null }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const { isAdmin } = useAuth()

  // ✅ Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        setError("")

        const filters = {
          status: filterStatus || undefined,
          search: searchQuery || undefined,
        }

        // Admin → all tasks | Normal user → their tasks
        const data =
          userRole === "admin"
            ? await taskService.getTasks(filters)
            : await taskService.getMyTasks(filters)

        // Assuming backend returns { data: Task[], total: number }
        setTasks(data?.data)
      } catch (err) {
        console.error("Failed to fetch tasks:", err)
        setError("Unable to load tasks. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [userRole, filterStatus, searchQuery])

  // ✅ Delete task
  const handleDelete = async (taskId: string) => {
    setDeleteError("")

    if (!isAdmin) {
      setDeleteError("Only administrators can delete tasks")
      return
    }

    try {
      await taskService.deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task._id !== taskId))
      console.log("Deleted task:", taskId)
    } catch (err) {
      console.error("Delete error:", err)
      setDeleteError("Failed to delete task. Please try again.")
    }
  }

  // ✅ Helpers
  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-primary" />
      case "pending":
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: Task["status"]) => {
    const variants = {
      completed: "bg-success/10 text-success border-success/20",
      "in-progress": "bg-primary/10 text-primary border-primary/20",
      pending: "bg-muted text-muted-foreground border-border",
    }

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.replace("-", " ")}
      </Badge>
    )
  }

  // ✅ Loading state
  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading tasks...
      </div>
    )
  }

  // ✅ Error state
  if (error) {
    return (
      <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // ✅ Empty state
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first task to get started
        </p>
      </div>
    )
  }

  // ✅ Render tasks
  return (
    <div className="space-y-4">
      {deleteError && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      {tasks.map((task) => (
        <div
          key={task?._id}
          className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(task.status)}
                <h3 className="font-semibold text-foreground">{task.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{task.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
               
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge(task.status)}
              {userRole === "admin" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(task._id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
