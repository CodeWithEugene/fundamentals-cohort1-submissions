import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="nav-inner container">
        <Link to="/" className="brand">LegacyBridge</Link>
        <nav className="main-nav">
          <NavLink to="/pricing" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Pricing</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Dashboard</NavLink>
          <NavLink to="/docs" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Docs</NavLink>
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <div className="nav-user">{user.name || user.email} {user.role === 'admin' && '(Admin)'}</div>
              <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost">Log in</NavLink>
              <NavLink to="/signup" className="btn btn-primary">Sign up</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
