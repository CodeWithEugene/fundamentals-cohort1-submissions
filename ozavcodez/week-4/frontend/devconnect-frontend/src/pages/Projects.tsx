import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Star, MessageSquare, User } from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { Project, projectAPI } from "../lib/api"
import { formatTime } from "../lib/utils"
import { useAuth } from "../hooks/useAuth"

export function Projects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll()
      // setProjects(response?.data)
      setProjects(response?.data?.data?.projects  || [])
    } catch (err) {
      setError("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Projects</h1>
          {user && (
            <Link to="/projects/new">
              <Button>Create Project</Button>
            </Link>
          )}
        </div>

        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive mb-6">{error}</div>}

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            {user && (
              <Link to="/projects/new">
                <Button>Create the first project</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold line-clamp-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{project.author?.username}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{project.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{project.comments?.length || 0}</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">{formatTime(project.createdAt)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
