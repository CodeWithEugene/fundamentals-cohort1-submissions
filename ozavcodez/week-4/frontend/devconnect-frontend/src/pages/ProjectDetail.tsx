"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Star, MessageSquare, User, ArrowLeft } from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { Input } from "../components/Input"
import { projectAPI, commentAPI } from "../lib/api"
import { formatTime } from "../lib/utils"
import { useAuth } from "../hooks/useAuth"
import type { Project, Comment } from "../lib/api"

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [commentText, setCommentText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  const fetchProject = async () => {
    if (!id) return
    try {
      const projectRes = await projectAPI.getById(id)
      setProject(projectRes.data.data.project)
      setLiked(projectRes.data.likes?.includes(user?._id || ""))

      const commentsRes = await commentAPI.getByProject(id)
      setComments(commentsRes.data.data.comments)
    } catch (err) {
      setError("Failed to load project")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    if (!id) return

    try {
      if (liked) {
        await projectAPI.unlike(id)
      } else {
        await projectAPI.like(id)
      }
      setLiked(!liked)
      fetchProject()
    } catch (err) {
      setError("Failed to update like")
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) {
      navigate("/login")
      return
    }

    if (!id) return

    setSubmitting(true)
    try {
      await commentAPI.create({
        projectId: id,
        content: commentText,
      })
      setCommentText("")
      fetchProject()
    } catch (err) {
      setError("Failed to post comment")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <Button onClick={() => navigate("/projects")}>Back to projects</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/projects")} className="mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive mb-6">{error}</div>}

        <Card className="mb-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{project.author?.username}</span>
                <span>•</span>
                <span>{formatTime(project.createdAt)}</span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground">{project.description}</p>

            <div className="flex items-center gap-4 pt-4">
              <Button variant={liked ? "primary" : "outline"} onClick={handleLike} className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {project.likes?.length || 0}
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{comments.length} comments</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>

          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                required
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? "Posting..." : "Post comment"}
              </Button>
            </form>
          ) : (
            <p className="text-muted-foreground mb-4">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Sign in
              </Button>
              to comment
            </p>
          )}

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-muted-foreground">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{comment.author?.username}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(comment.createdAt)}</span>
                  </div>
                  <p className="text-foreground">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
