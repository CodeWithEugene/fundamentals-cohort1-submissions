import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Lock, Unlock, Search, UserCog } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  role: "user" | "admin"
  isLocked: boolean
  failedLoginAttempts: number
  lastLogin: string
  createdAt: string
}

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    role: "user",
    isLocked: false,
    failedLoginAttempts: 0,
    lastLogin: "2025-01-10 14:30",
    createdAt: "2025-01-01",
  },
  {
    id: "2",
    username: "janedoe",
    email: "jane@example.com",
    role: "admin",
    isLocked: false,
    failedLoginAttempts: 0,
    lastLogin: "2025-01-10 15:45",
    createdAt: "2025-01-01",
  },
  {
    id: "3",
    username: "bobsmith",
    email: "bob@example.com",
    role: "user",
    isLocked: true,
    failedLoginAttempts: 3,
    lastLogin: "2025-01-09 10:20",
    createdAt: "2025-01-05",
  },
  {
    id: "4",
    username: "alicejones",
    email: "alice@example.com",
    role: "user",
    isLocked: false,
    failedLoginAttempts: 1,
    lastLogin: "2025-01-10 09:15",
    createdAt: "2025-01-03",
  },
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    setSuccessMessage("")
    setErrorMessage("")

    // TODO: Implement actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
      setSuccessMessage(`Role updated successfully`)
    } catch (err) {
      setErrorMessage("Failed to update role")
    }
  }

  const handleLockToggle = async (userId: string, currentLockStatus: boolean) => {
    setSuccessMessage("")
    setErrorMessage("")

    // TODO: Implement actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                isLocked: !currentLockStatus,
                failedLoginAttempts: currentLockStatus ? 0 : user.failedLoginAttempts,
              }
            : user,
        ),
      )
      setSuccessMessage(`Account ${currentLockStatus ? "unlocked" : "locked"} successfully`)
    } catch (err) {
      setErrorMessage("Failed to update account status")
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <Alert className="bg-success/10 border-success/50">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">{user.username}</h3>
                  </div>
                  {user.role === "admin" && (
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                  {user.isLocked && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Last login: {user.lastLogin}</span>
                  <span>•</span>
                  <span>Failed attempts: {user.failedLoginAttempts}</span>
                  <span>•</span>
                  <span>Joined: {user.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value as "user" | "admin")}
                >
                  <SelectTrigger className="w-[120px] bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLockToggle(user.id, user.isLocked)}
                  className={
                    user.isLocked ? "text-success hover:text-success" : "text-destructive hover:text-destructive"
                  }
                >
                  {user.isLocked ? (
                    <>
                      <Unlock className="h-4 w-4 mr-1" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-1" />
                      Lock
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}
    </div>
  )
}
