"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { User, Mail, MapPin } from "lucide-react"
import { Card } from "../components/Card"
import { userAPI, projectAPI } from "../lib/api"
import { formatDate } from "../lib/utils"
import type { User as UserType, Project } from "../lib/api"

export function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState<UserType | null>(null)
  const [userProjects, setUserProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (id) {
      fetchUserProfile()
    }
  }, [id])

  const fetchUserProfile = async () => {
    if (!id) return
    try {
      const userRes = await userAPI.getUserById(id)
      console.log(userRes.data.data.user)
      setUserProfile(userRes.data.data.user)

      const projectsRes = await projectAPI.getAll({ author: userRes.data._id })
      setUserProjects(projectsRes.data.data.projects)
    } catch (err) {
      setError("Failed to load user profile")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">User not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive mb-6">{error}</div>}

        <Card className="mb-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold capitalize">{userProfile.username}</h1>
                {userProfile.bio && <p className="text-muted-foreground mt-2">{userProfile.bio}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {userProfile.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.email}</span>
                </div>
              )}
              {userProfile.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.location}</span>
                </div>
              )}
            </div>

            {userProfile.skills && userProfile.skills.length > 0 && (
              <div className="pt-4">
                <p className="text-sm font-semibold mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills?.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-primary/20 text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground pt-4">Joined {formatDate(userProfile.createdAt)}</p>
          </div>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Projects ({userProjects.length})</h2>
          {userProjects.length === 0 ? (
            <p className="text-muted-foreground">No projects yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {userProjects.map((project) => (
                <Card
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
