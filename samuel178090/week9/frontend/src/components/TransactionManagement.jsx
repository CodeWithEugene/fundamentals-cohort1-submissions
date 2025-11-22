import React, { useState, useEffect } from 'react';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const { getAllTransactionsAdmin } = await import('../services/api');
      const result = await getAllTransactionsAdmin();
      setTransactions(result.data || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReverseTransaction = async (transactionId) => {
    const reason = prompt('Enter reason for reversal:');
    if (!reason) return;

    try {
      const { reverseTransaction } = await import('../services/api');
      await reverseTransaction(transactionId, { reason });
      loadTransactions();
      alert('✅ Transaction reversed successfully');
    } catch (error) {
      alert('❌ Failed to reverse transaction');
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    if (filter === 'all') return true;
    return txn.type === filter;
  });

  if (loading) return <div className="loading">Loading transactions...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3>💳 Transaction Management</h3>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
        >
          <option value="all">All Transactions</option>
          <option value="transfer">Transfers</option>
          <option value="bill_payment">Bill Payments</option>
          <option value="refund">Refunds</option>
        </select>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h4>📊 Transaction Summary</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <div>
            <p><strong>Total Volume:</strong></p>
            <p>₦{(transactions.reduce((sum, t) => sum + t.amount, 0) / 100).toLocaleString()}</p>
          </div>
          <div>
            <p><strong>Total Count:</strong></p>
            <p>{transactions.length}</p>
          </div>
          <div>
            <p><strong>Completed:</strong></p>
            <p>{transactions.filter(t => t.status === 'completed' || t.status === 'successful').length}</p>
          </div>
          <div>
            <p><strong>Pending:</strong></p>
            <p>{transactions.filter(t => t.status === 'processing').length}</p>
          </div>
        </div>
      </div>

      <div className="grid">
        {filteredTransactions.map(transaction => (
          <div key={transaction.id} className="card">
            <h4>{transaction.type.replace('_', ' ').toUpperCase()}</h4>
            <p><strong>ID:</strong> {transaction.id}</p>
            <p><strong>Amount:</strong> ₦{(transaction.amount / 100).toLocaleString()}</p>
            <p><strong>Status:</strong> 
              <span className={`status ${transaction.status === 'completed' || transaction.status === 'successful' ? 'succeeded' : 
                transaction.status === 'processing' ? 'processing' : 'canceled'}`}>
                {transaction.status}
              </span>
            </p>
            <p><strong>Reference:</strong> {transaction.reference}</p>
            
            {transaction.sender && <p><strong>Sender:</strong> {transaction.sender}</p>}
            {transaction.recipient && <p><strong>Recipient:</strong> {transaction.recipient}</p>}
            {transaction.payer && <p><strong>Payer:</strong> {transaction.payer}</p>}
            {transaction.provider && <p><strong>Provider:</strong> {transaction.provider}</p>}
            
            <p><strong>Date:</strong> {new Date(transaction.created * 1000).toLocaleString()}</p>
            
            <div style={{ marginTop: 12 }}>
              {(transaction.status === 'completed' || transaction.status === 'successful') && (
                <button 
                  className="btn btn-ghost"
                  onClick={() => handleReverseTransaction(transaction.id)}
                  style={{ color: '#dc3545' }}
                >
                  Reverse Transaction
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionManagement;