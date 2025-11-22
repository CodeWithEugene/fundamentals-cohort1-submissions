import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    adminCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Only allow admin signup if user is already admin or if it's the first admin
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.role !== 'admin') {
      setError('Only existing admin can create new admin accounts');
      setLoading(false);
      return;
    }
    
    // Simple admin code check
    if (formData.adminCode !== 'ADMIN2024') {
      setError('Invalid admin access code');
      setLoading(false);
      return;
    }

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'admin'
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Admin signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth container">
      <div className="card">
        <h2>🔐 Admin Registration</h2>
        <p>Create an administrator account with full system access</p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Admin Access Code:
            <input
              type="password"
              value={formData.adminCode}
              onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
              placeholder="Enter admin access code"
              required
            />
          </label>
          
          <label>
            Full Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Administrator Name"
              required
            />
          </label>
          
          <label>
            Email:
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="admin@example.com"
              required
            />
          </label>
          
          <label>
            Password:
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Strong password"
              required
            />
          </label>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
          </button>
        </form>
        
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link to="/login">Already have an account? Login</Link><br/>
          <Link to="/signup">Regular user signup</Link>
        </div>
        
        <div style={{ marginTop: 15, padding: 10, background: '#fff3cd', borderRadius: 4 }}>
          <small><strong>Demo Code:</strong> ADMIN2024</small>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;