import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTransactionPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    type: 'credit',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create transaction');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-transaction">
      <header>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Create New Transaction</h1>
      </header>

      <main>
        <section className="form-section">
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userId">User:</label>
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Transaction'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CreateTransactionPage;