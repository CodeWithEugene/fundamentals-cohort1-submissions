import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminSignup from './pages/AdminSignup';
import PaymentsList from './components/PaymentsList';
import CustomersList from './components/CustomersList';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './AuthContext';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="site-root">
          <Navbar />

          <main className="site-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin-signup" element={<AdminSignup />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/docs" element={<div className="container card"><h2>LegacyBridge Dashboard</h2>
                <h3>Features</h3>
                <ul>
                  <li>₦ <strong>NGN Currency Support</strong> - All amounts displayed in Nigerian Naira</li>
                  <li>💳 <strong>Payment Management</strong> - View and refund payments</li>
                  <li>👥 <strong>Customer Dashboard</strong> - Manage customer accounts</li>
                  <li>🔔 <strong>Notifications</strong> - Send customer notifications</li>
                  <li>🔐 <strong>Secure Authentication</strong> - JWT-based login system</li>
                </ul>
                <h3>How to Use</h3>
                <ol>
                  <li>Sign up for an account or login</li>
                  <li>Navigate to Dashboard to view data</li>
                  <li>Use Refund buttons to process payment refunds</li>
                  <li>Use Notify buttons to send customer notifications</li>
                </ol>
                <h3>Technology</h3>
                <p>Built with React + Vite, connecting to Node.js backend API for legacy system integration.</p>
                <h3>Live Demo</h3>
                <p>This dashboard transforms legacy payment data into modern Stripe-like format with Nigerian Naira support.</p>
                <p><strong>Backend API:</strong> <a href="https://legacybridge-backend-un5w.onrender.com/health" target="_blank">Health Check</a></p>
              </div>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;