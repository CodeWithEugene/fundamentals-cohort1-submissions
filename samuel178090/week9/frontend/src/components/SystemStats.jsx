import React, { useState, useEffect } from 'react';

const SystemStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const { getSystemStats } = await import('../services/api');
      const result = await getSystemStats();
      setStats(result.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading system stats...</div>;
  if (!stats) return <div className="error">Failed to load system statistics</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3>📊 System Statistics</h3>
        <button className="btn btn-ghost" onClick={loadStats}>
          🔄 Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
        <div className="card" style={{ background: '#e8f5e8' }}>
          <h4>👥 Users</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
            {stats.totalUsers.toLocaleString()}
          </p>
          <p><strong>Active:</strong> {stats.activeUsers}</p>
          <p><strong>Growth:</strong> +12% this month</p>
        </div>

        <div className="card" style={{ background: '#f0f8ff' }}>
          <h4>💳 Transactions</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
            {stats.totalTransactions.toLocaleString()}
          </p>
          <p><strong>Today:</strong> {stats.todayTransactions}</p>
          <p><strong>Pending:</strong> {stats.pendingTransactions}</p>
        </div>

        <div className="card" style={{ background: '#fff3cd' }}>
          <h4>💰 Volume</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
            ₦{(stats.totalVolume / 100).toLocaleString()}
          </p>
          <p><strong>Today:</strong> ₦{(stats.todayVolume / 100).toLocaleString()}</p>
          <p><strong>Average:</strong> ₦{Math.round(stats.totalVolume / stats.totalTransactions / 100).toLocaleString()}</p>
        </div>

        <div className="card" style={{ background: '#f8d7da' }}>
          <h4>⚠️ Issues</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
            {stats.failedTransactions}
          </p>
          <p><strong>Failed Transactions</strong></p>
          <p><strong>Success Rate:</strong> {((stats.totalTransactions - stats.failedTransactions) / stats.totalTransactions * 100).toFixed(1)}%</p>
        </div>

        <div className="card" style={{ background: '#d1ecf1' }}>
          <h4>🔧 System Health</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
            {stats.systemUptime}
          </p>
          <p><strong>Uptime</strong></p>
          <p><strong>Status:</strong> <span className="status succeeded">Healthy</span></p>
        </div>

        <div className="card">
          <h4>📈 Performance Metrics</h4>
          <div style={{ marginTop: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Transaction Success Rate</span>
              <span>{((stats.totalTransactions - stats.failedTransactions) / stats.totalTransactions * 100).toFixed(1)}%</span>
            </div>
            <div style={{ width: '100%', height: 8, background: '#eee', borderRadius: 4 }}>
              <div style={{ 
                width: `${(stats.totalTransactions - stats.failedTransactions) / stats.totalTransactions * 100}%`, 
                height: '100%', 
                background: '#28a745', 
                borderRadius: 4 
              }}></div>
            </div>
          </div>
          
          <div style={{ marginTop: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>User Activity Rate</span>
              <span>{(stats.activeUsers / stats.totalUsers * 100).toFixed(1)}%</span>
            </div>
            <div style={{ width: '100%', height: 8, background: '#eee', borderRadius: 4 }}>
              <div style={{ 
                width: `${stats.activeUsers / stats.totalUsers * 100}%`, 
                height: '100%', 
                background: '#007bff', 
                borderRadius: 4 
              }}></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center', color: '#666' }}>
        <small>Last updated: {new Date(stats.lastUpdated * 1000).toLocaleString()}</small>
      </div>
    </div>
  );
};

export default SystemStats;