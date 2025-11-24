import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navigation from "./components/Navigation"
import Dashboard from "./pages/Dashboard"
import Users from "./pages/Users"
import Activities from "./pages/Activities"
import Meals from "./pages/Meals"
import Appointments from "./pages/Appointments"
import Reports from "./pages/Reports"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
