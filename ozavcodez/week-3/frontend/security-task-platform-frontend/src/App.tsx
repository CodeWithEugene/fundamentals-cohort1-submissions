import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import RegisterPage from "./pages/register/page"
import DashboardPage from "./pages/dashboard/page"
import AdminPage from "./pages/admin/page"
import LoginPage from "./pages/login"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./services/ProtectedRoutes"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
               </ProtectedRoute>
            }
          />

          {/* Admin only routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App