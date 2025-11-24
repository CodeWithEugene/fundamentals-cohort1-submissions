"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/Button"
import { ProjectForm } from "../components/ProjectForm"
import { useAuth } from "../hooks/useAuth"
import { projectAPI } from "../lib/api"
import type { Project } from "../lib/api"

export function CreateProject() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">You need to be logged in to create a project</p>
          <Button onClick={() => navigate("/login")}>Sign in</Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (data: Partial<Project>) => {
    setIsLoading(true)
    try {
      const response = await projectAPI.create(data)
      navigate(`/projects/${response.data._id}`)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/projects")} className="mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Project</h1>
          <p className="text-muted-foreground">Share your project idea with the developer community</p>
        </div>

        <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}
