import { useEffect, useState } from 'react';
import { getStats, PaymentStats } from '../services/api';
import './StatsPage.css';

function StatsPage() {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getStats();
      setStats(data.stats);
      setCached(data.cached);
    } catch (err) {
      console.error(err);
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) {
    return <div className="panel">Loading stats...</div>;
  }

  if (error) {
    return (
      <div className="panel error">
        <p>{error}</p>
        <button onClick={load}>Retry</button>
      </div>
    );
  }

  if (!stats) {
    return <div className="panel">No stats available yet.</div>;
  }

  return (
    <div className="stats-page">
      <div className="panel header-panel">
        <div>
          <h2>Payment Stats</h2>
          <p className="subtitle">
            In-memory cached aggregate view (Redis vs in-memory trade-off)
          </p>
        </div>
        <button onClick={load}>Refresh</button>
      </div>

      <div className="panel grid">
        <div className="metric">
          <span className="label">Total Volume</span>
          <span className="value">${stats.totalVolume.toFixed(2)}</span>
        </div>
        <div className="metric">
          <span className="label">Total Count</span>
          <span className="value">{stats.totalCount}</span>
        </div>
        <div className="metric">
          <span className="label">Pending</span>
          <span className="value">{stats.byStatus.PENDING}</span>
        </div>
        <div className="metric">
          <span className="label">Completed</span>
          <span className="value">{stats.byStatus.COMPLETED}</span>
        </div>
        <div className="metric">
          <span className="label">Failed</span>
          <span className="value">{stats.byStatus.FAILED}</span>
        </div>
      </div>

      <div className="panel cache-indicator">
        <span className={`dot ${cached ? 'dot-green' : 'dot-gray'}`}></span>
        <span>
          Response {cached ? 'served from' : 'not served from'} in-memory cache
        </span>
      </div>
    </div>
  );
}

export default StatsPage;
