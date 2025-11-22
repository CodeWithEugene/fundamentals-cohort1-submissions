import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import PaymentsList from './PaymentsList';
import CustomersList from './CustomersList';
import TransferMoney from './TransferMoney';
import BillPayment from './BillPayment';
import UserManagement from './UserManagement';
import TransactionManagement from './TransactionManagement';
import SystemStats from './SystemStats';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Determine user role based on email
  const isAdmin = user?.email === 'sam@example.com' || user?.email?.includes('admin');
  
  if (isAdmin) {
    return (
      <div className="container">
        <div className="card" style={{ marginBottom: 20, background: '#e8f5e8' }}>
          <h2>🔐 Admin Dashboard</h2>
          <p>Welcome back, <strong>{user.name}</strong>! You have full administrative access.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <span className="status active">Admin Access</span>
            <span className="status succeeded">Full Permissions</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button 
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button 
            className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('transactions')}
          >
            💳 Transactions
          </button>
          <button 
            className={`btn ${activeTab === 'payments' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('payments')}
          >
            💰 Payments
          </button>
        </div>
        
        {activeTab === 'overview' && <SystemStats />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'transactions' && <TransactionManagement />}
        {activeTab === 'payments' && (
          <div>
            <PaymentsList />
            <CustomersList />
          </div>
        )}
      </div>
    );
  }
  
  // Regular user dashboard
  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 20, background: '#f0f8ff' }}>
        <h2>👤 User Dashboard</h2>
        <p>Welcome, <strong>{user.name}</strong>! View your payment history and account details.</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <span className="status processing">User Access</span>
          <span className="status active">Limited Permissions</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <h3>💳 Your Account</h3>
          <p><strong>Account Status:</strong> Active</p>
          <p><strong>Plan:</strong> Growth Plan</p>
          <p><strong>Balance:</strong> ₦45,000</p>
        </div>
        <div className="card">
          <h3>📈 Quick Stats</h3>
          <p><strong>Your Payments:</strong> 12</p>
          <p><strong>This Month:</strong> ₦125,000</p>
          <p><strong>Last Payment:</strong> 2 days ago</p>
        </div>
      </div>
      
      {/* User Operations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <TransferMoney onTransferComplete={(transfer) => {
          alert(`Transfer completed: ${transfer.id}`);
        }} />
        <BillPayment onPaymentComplete={(payment) => {
          alert(`Bill paid: ${payment.reference}`);
        }} />
      </div>
      
      <div className="card">
        <h3>📊 Transaction History</h3>
        <div style={{ padding: 15, background: '#f0f8ff', borderRadius: 4, marginTop: 10 }}>
          <p>💳 <strong>Recent Activity:</strong></p>
          <p>• Transfer to john@example.com - ₦15,000</p>
          <p>• AEDC Electricity Bill - ₦8,500</p>
          <p>• MTN Airtime Purchase - ₦2,000</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;