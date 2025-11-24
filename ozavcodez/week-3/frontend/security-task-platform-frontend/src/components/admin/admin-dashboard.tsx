"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Lock, Activity, ArrowLeft } from "lucide-react"
import { UserManagement } from "./user-management"
import { SystemLogs } from "./system-logs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth"

export function AdminDashboard() {
  // const { user, logout, isAdmin } = useAuth()
  // const navigate = useNavigate()

  // const handleLogout = async () => {
  //   await logout()
  //   navigate("/login")
  // }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg border border-destructive/20">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Full System Access</p>
              </div>
            </div>

            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Users
                </CardDescription>
                <CardTitle className="text-3xl">24</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admins
                </CardDescription>
                <CardTitle className="text-3xl text-destructive">3</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Locked Accounts
                </CardDescription>
                <CardTitle className="text-3xl text-primary">2</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Active Sessions
                </CardDescription>
                <CardTitle className="text-3xl text-success">18</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Admin Tabs */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>System Management</CardTitle>
              <CardDescription>Manage users, roles, and monitor system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="users">User Management</TabsTrigger>
                  <TabsTrigger value="logs">System Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="mt-6">
                  <UserManagement />
                </TabsContent>

                <TabsContent value="logs" className="mt-6">
                  <SystemLogs />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
