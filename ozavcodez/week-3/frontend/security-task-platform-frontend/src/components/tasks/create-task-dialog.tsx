"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { taskService } from "@/services/taskService" // ✅ use your real API service
import { useAuth } from "@/hooks/useAuth" // if you want to attach user ID or token automatically

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated?: () => void // optional callback to refresh task list
}

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated }: CreateTaskDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth() // optional, if you need creator info

  // ✅ Handle text input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // ✅ Handle status change
  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }))
  }

  // ✅ Basic validation against script injection
  const validateInput = (input: string): boolean => {
    const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i, /\$\{/, /`/, /<iframe/i, /<object/i, /<embed/i]
    return !dangerousPatterns.some((pattern) => pattern.test(input))
  }

  // ✅ Basic sanitization
  const sanitizeInput = (input: string): string => {
    return input.replace(/[<>]/g, "").replace(/javascript:/gi, "").trim()
  }

  // ✅ Handle submit (API call)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    // Client-side validation
    if (!validateInput(formData.title) || !validateInput(formData.description)) {
      setError("Invalid input detected. Please remove any special characters or scripts.")
      setIsLoading(false)
      return
    }

    if (formData.title.length < 3) {
      setError("Title must be at least 3 characters long")
      setIsLoading(false)
      return
    }

    if (formData.description.length < 10) {
      setError("Description must be at least 10 characters long")
      setIsLoading(false)
      return
    }

    const sanitizedData = {
      title: sanitizeInput(formData.title),
      description: sanitizeInput(formData.description),
      status: formData.status,
    }

    try {
      // ✅ Real API call
      await taskService.createTask(sanitizedData)

      setSuccess(true)
      if (onTaskCreated) onTaskCreated() // refresh list if provided

      setTimeout(() => {
        onOpenChange(false)
        setFormData({ title: "", description: "", status: "pending" })
        setSuccess(false)
      }, 1200)
    } catch (err) {
      console.error("Task creation failed:", err)
      setError("Failed to create task. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to your list. All fields are required.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-success/10 border-success/50">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">Task created successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              className="bg-secondary/50 border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
              className="bg-secondary/50 border-border/50 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || success}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
