import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Activity, AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  type: "info" | "success" | "warning" | "error"
  action: string
  user: string
  details: string
  ipAddress: string
}

// Mock log data
const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2025-01-10 15:45:23",
    type: "success",
    action: "User Login",
    user: "janedoe",
    details: "Successful authentication with valid JWT token",
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    timestamp: "2025-01-10 15:30:12",
    type: "error",
    action: "Failed Login",
    user: "bobsmith",
    details: "Account locked after 3 failed login attempts",
    ipAddress: "192.168.1.105",
  },
  {
    id: "3",
    timestamp: "2025-01-10 15:15:45",
    type: "warning",
    action: "Injection Attempt",
    user: "unknown",
    details: "Blocked SQL injection attempt in task creation endpoint",
    ipAddress: "203.0.113.42",
  },
  {
    id: "4",
    timestamp: "2025-01-10 14:50:33",
    type: "success",
    action: "Task Created",
    user: "johndoe",
    details: "New task created with proper input validation",
    ipAddress: "192.168.1.101",
  },
  {
    id: "5",
    timestamp: "2025-01-10 14:30:18",
    type: "info",
    action: "Role Changed",
    user: "admin",
    details: "User role updated from 'user' to 'admin' for janedoe",
    ipAddress: "192.168.1.1",
  },
  {
    id: "6",
    timestamp: "2025-01-10 14:15:55",
    type: "error",
    action: "Unauthorized Access",
    user: "johndoe",
    details: "Attempted to delete task without admin privileges",
    ipAddress: "192.168.1.101",
  },
  {
    id: "7",
    timestamp: "2025-01-10 13:45:22",
    type: "success",
    action: "Token Refresh",
    user: "alicejones",
    details: "Access token refreshed successfully",
    ipAddress: "192.168.1.103",
  },
  {
    id: "8",
    timestamp: "2025-01-10 13:20:10",
    type: "warning",
    action: "Rate Limit",
    user: "unknown",
    details: "Rate limit exceeded for login endpoint",
    ipAddress: "198.51.100.23",
  },
]

export function SystemLogs() {
  const [logs] = useState<LogEntry[]>(mockLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const getLogIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-primary" />
      case "info":
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getLogBadge = (type: LogEntry["type"]) => {
    const variants = {
      success: "bg-success/10 text-success border-success/20",
      error: "bg-destructive/10 text-destructive border-destructive/20",
      warning: "bg-primary/10 text-primary border-primary/20",
      info: "bg-muted text-muted-foreground border-border",
    }

    return (
      <Badge variant="outline" className={variants[type]}>
        {type}
      </Badge>
    )
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterType === "all" || log.type === filterType

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs by action, user, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px] bg-secondary/50 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <div className="space-y-2">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">{getLogIcon(log.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground text-sm">{log.action}</h4>
                    {getLogBadge(log.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {log.timestamp}
                    </span>
                    <span>•</span>
                    <span>User: {log.user}</span>
                    <span>•</span>
                    <span>IP: {log.ipAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No logs found</p>
        </div>
      )}
    </div>
  )
}
