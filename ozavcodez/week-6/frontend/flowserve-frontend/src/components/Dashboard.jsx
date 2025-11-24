import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch users from backend API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions from backend API
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/transactions');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Load data when component mounts
  useEffect(() => {
    fetchUsers();
    fetchTransactions();
  }, []);

  return (
    <div className="dashboard">
      <header>
        <div className="header-content">
          <h1>FlowServe Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main>
        <section className="stats-section">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{users.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Transactions</h3>
            <p className="stat-value">{transactions.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Balance</h3>
            <p className="stat-value">
              ${users.reduce((sum, user) => sum + parseFloat(user.walletBalance || 0), 0).toFixed(2)}
            </p>
          </div>
        </section>

        <div className="content-grid">
          <section className="users-section">
            <div className="section-header">
              <h2>Users</h2>
              <button onClick={fetchUsers}>Refresh</button>
            </div>
            {loading && <p>Loading users...</p>}
            {error && <p className="error">Error: {error}</p>}
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>${user.walletBalance}</td>
                      <td>
                        <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="transactions-section">
            <div className="section-header">
              <h2>Recent Transactions</h2>
              <button onClick={fetchTransactions}>Refresh</button>
            </div>
            {loading && <p>Loading transactions...</p>}
            {error && <p className="error">Error: {error}</p>}
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>User #{transaction.userId}</td>
                      <td>
                        <span className={`type ${transaction.type}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>${transaction.amount}</td>
                      <td>
                        <span className={`status ${transaction.status}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;