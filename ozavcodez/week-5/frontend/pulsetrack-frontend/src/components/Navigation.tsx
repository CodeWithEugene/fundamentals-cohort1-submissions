import { Link, useLocation } from "react-router-dom"
import "./Navigation.css"

export default function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="navigation">
      <div className="nav-header">
        <div className="nav-logo">
          <div className="logo-icon">💚</div>
          <span>PulseTrack</span>
        </div>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/users" className={`nav-link ${isActive("/users") ? "active" : ""}`}>
            <span className="nav-icon">👥</span>
            <span>Users</span>
          </Link>
        </li>
        <li>
          <Link to="/activities" className={`nav-link ${isActive("/activities") ? "active" : ""}`}>
            <span className="nav-icon">🏃</span>
            <span>Activities</span>
          </Link>
        </li>
        <li>
          <Link to="/meals" className={`nav-link ${isActive("/meals") ? "active" : ""}`}>
            <span className="nav-icon">🍎</span>
            <span>Meals</span>
          </Link>
        </li>
        <li>
          <Link to="/appointments" className={`nav-link ${isActive("/appointments") ? "active" : ""}`}>
            <span className="nav-icon">📅</span>
            <span>Appointments</span>
          </Link>
        </li>
        <li>
          <Link to="/reports" className={`nav-link ${isActive("/reports") ? "active" : ""}`}>
            <span className="nav-icon">📈</span>
            <span>Reports</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
