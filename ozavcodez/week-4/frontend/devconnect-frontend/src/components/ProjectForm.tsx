"use client"

import type React from "react"
import { useState } from "react"
import type { Project } from "../lib/api"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Card } from "@/components/Card"

interface ProjectFormProps {
  onSubmit: (data: Partial<Project>) => Promise<void>
  initialData?: Partial<Project>
  isLoading?: boolean
}

export function ProjectForm({ onSubmit, initialData, isLoading = false }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim()) {
      setError("Project title is required")
      return
    }

    if (!formData.description.trim()) {
      setError("Project description is required")
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project")
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-2">Project Title</label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter project title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project..."
            rows={6}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Create Project"}
        </Button>
      </form>
    </Card>
  )
}
