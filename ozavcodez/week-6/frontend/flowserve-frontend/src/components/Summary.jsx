import React from 'react';

const Summary = ({ transactions, users }) => {
  const totalTransactions = transactions.length;
  const totalUsers = users.length;
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingTransactions = transactions.filter(t => t.status === 'Pending').length;
  
  const completedTransactions = transactions.filter(t => t.status === 'Completed');
  const totalCompletedVolume = completedTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <h3>Total Transactions</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#646cff' }}>{totalTransactions}</p>
      </div>
      
      <div className="card" style={{ textAlign: 'center' }}>
        <h3>Active Users</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#646cff' }}>{totalUsers}</p>
      </div>
      
      <div className="card" style={{ textAlign: 'center' }}>
        <h3>Total Volume</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#646cff' }}>${totalVolume.toFixed(2)}</p>
      </div>
      
      <div className="card" style={{ textAlign: 'center' }}>
        <h3>Pending Transactions</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#646cff' }}>{pendingTransactions}</p>
      </div>
      
      <div className="card" style={{ textAlign: 'center' }}>
        <h3>Completed Volume</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#646cff' }}>${totalCompletedVolume.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Summary;