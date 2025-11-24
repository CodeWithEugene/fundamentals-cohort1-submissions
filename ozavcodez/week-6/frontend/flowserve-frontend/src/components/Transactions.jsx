import React, { useState, useEffect } from 'react';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchTransactions();
  }, []);

  return (
    <div>
      <h1>Transactions</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            User ID: {transaction.userId} - {transaction.type} - ${transaction.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;