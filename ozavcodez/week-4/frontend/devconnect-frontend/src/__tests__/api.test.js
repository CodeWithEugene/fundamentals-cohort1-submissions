import { describe, it, expect, vi, beforeEach } from "vitest"
import apiClient, { authAPI, projectAPI, userAPI } from "../lib/api"

// Mock axios
vi.mock("axios")

describe("API Client", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe("authAPI", () => {
    it("should call register endpoint with correct data", async () => {
      const mockData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      }

      // Mock the API response
      vi.spyOn(apiClient, "post").mockResolvedValueOnce({
        data: { token: "mock-token", user: mockData },
      })

      const result = await authAPI.register(mockData)
      expect(result.data.token).toBe("mock-token")
    })

    it("should call login endpoint with correct data", async () => {
      const mockData = {
        email: "test@example.com",
        password: "password123",
      }

      vi.spyOn(apiClient, "post").mockResolvedValueOnce({
        data: { token: "mock-token", user: { username: "testuser" } },
      })

      const result = await authAPI.login(mockData)
      expect(result.data.token).toBe("mock-token")
    })

    it("should clear localStorage on logout", () => {
      localStorage.setItem("token", "mock-token")
      localStorage.setItem("user", JSON.stringify({ username: "testuser" }))

      authAPI.logout()

      expect(localStorage.getItem("token")).toBeNull()
      expect(localStorage.getItem("user")).toBeNull()
    })
  })

  describe("projectAPI", () => {
    it("should fetch all projects", async () => {
      const mockProjects = [
        { _id: "1", title: "Project 1" },
        { _id: "2", title: "Project 2" },
      ]

      vi.spyOn(apiClient, "get").mockResolvedValueOnce({
        data: mockProjects,
      })

      const result = await projectAPI.getAll()
      expect(result.data).toHaveLength(2)
    })

    it("should fetch project by id", async () => {
      const mockProject = { _id: "1", title: "Project 1" }

      vi.spyOn(apiClient, "get").mockResolvedValueOnce({
        data: mockProject,
      })

      const result = await projectAPI.getById("1")
      expect(result.data._id).toBe("1")
    })
  })

  describe("userAPI", () => {
    it("should fetch user by username", async () => {
      const mockUser = { username: "testuser", email: "test@example.com" }

      vi.spyOn(apiClient, "get").mockResolvedValueOnce({
        data: mockUser,
      })

      const result = await userAPI.getByUsername("testuser")
      expect(result.data.username).toBe("testuser")
    })
  })
})
