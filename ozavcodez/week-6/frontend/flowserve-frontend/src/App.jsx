import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './components/Dashboard';
import UserDetailPage from './components/UserDetail';
import TransactionDetailPage from './components/TransactionDetailPage';
import CreateTransactionPage from './components/TransactionForm';
import { AuthProvider } from './components/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/users/:id" element={<ProtectedRoute><UserDetailPage /></ProtectedRoute>} />
                        <Route path="/transactions/:id" element={<ProtectedRoute><TransactionDetailPage /></ProtectedRoute>} />
                        <Route path="/transactions/create" element={<ProtectedRoute><CreateTransactionPage /></ProtectedRoute>} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;