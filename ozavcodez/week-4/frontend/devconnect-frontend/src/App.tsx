import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProjectDetail } from "./pages/ProjectDetail";
import { UserProfile } from "./pages/UserProfile";
import { Projects } from "./pages/Projects";
import { CreateProject } from "./pages/CreateProject";
import { ProtectedRoute } from "./components/ProtectedRoutes";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            // <ProtectedRoute>
              <Home />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            // <ProtectedRoute>
              <Projects />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/projects/new"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            // <ProtectedRoute>
              <ProjectDetail />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
