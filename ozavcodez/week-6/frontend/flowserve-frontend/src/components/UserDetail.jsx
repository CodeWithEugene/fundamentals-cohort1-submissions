import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/transactions?userId=${id}`);
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

    fetchUser();
    fetchUserTransactions();
  }, [id]);

  const handleDeleteUser = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          navigate('/dashboard');
        } else {
          setError('Failed to delete user');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="user-detail">
      <header>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h1>User Details</h1>
          <div className="actions">
            <button onClick={() => navigate(`/users/${id}/edit`)}>Edit User</button>
            <button onClick={handleDeleteUser} className="delete-btn">Delete User</button>
          </div>
        </div>
      </header>

      <main>
        <section className="user-info">
          <h2>User Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>ID:</label>
              <span>{user.id}</span>
            </div>
            <div className="info-item">
              <label>Name:</label>
              <span>{user.firstName} {user.lastName}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Balance:</label>
              <span className="balance">${user.walletBalance}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="info-item">
              <label>Created:</label>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </section>

        <section className="user-transactions">
          <div className="section-header">
            <h2>Transactions</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
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
      </main>
    </div>
  );
};

export default UserDetailPage;