import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TransactionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/transactions/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const transactionData = await response.json();
        setTransaction(transactionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleDeleteTransaction = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/transactions/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          navigate('/dashboard');
        } else {
          setError('Failed to delete transaction');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading transaction details...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!transaction) return <p>Transaction not found</p>;

  return (
    <div className="transaction-detail">
      <header>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h1>Transaction Details</h1>
          <div className="actions">
            <button onClick={() => navigate(`/transactions/${id}/edit`)}>Edit Transaction</button>
            <button onClick={handleDeleteTransaction} className="delete-btn">Delete Transaction</button>
          </div>
        </div>
      </header>

      <main>
        <section className="transaction-info">
          <h2>Transaction Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>ID:</label>
              <span>{transaction.id}</span>
            </div>
            <div className="info-item">
              <label>User ID:</label>
              <span>{transaction.userId}</span>
            </div>
            <div className="info-item">
              <label>Type:</label>
              <span className={`type ${transaction.type}`}>{transaction.type}</span>
            </div>
            <div className="info-item">
              <label>Amount:</label>
              <span className="amount">${transaction.amount}</span>
            </div>
            <div className="info-item">
              <label>Description:</label>
              <span>{transaction.description || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status ${transaction.status}`}>
                {transaction.status}
              </span>
            </div>
            <div className="info-item">
              <label>Created:</label>
              <span>{new Date(transaction.createdAt).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <label>Updated:</label>
              <span>{new Date(transaction.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TransactionDetailPage;