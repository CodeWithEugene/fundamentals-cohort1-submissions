import { useEffect, useState } from 'react';
import { createPayment, getPayments, Payment } from '../services/api';
import './PaymentsPage.css';

function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getPayments();
      setPayments(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleCreate = async () => {
    try {
      setCreating(true);
      await createPayment({
        userId: 'demo-user',
        amount: Number((Math.random() * 100).toFixed(2)),
        currency: 'USD',
        region: 'us-east-1',
      });
      await load();
    } catch (err) {
      console.error(err);
      setError('Failed to create payment');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="panel">Loading payments...</div>;
  }

  if (error) {
    return (
      <div className="panel error">
        <p>{error}</p>
        <button onClick={load}>Retry</button>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="panel header-panel">
        <div>
          <h2>Recent Payments</h2>
          <p className="subtitle">REST + SQL-style listing with filters (PoC)</p>
        </div>
        <button onClick={handleCreate} disabled={creating}>
          {creating ? 'Creating...' : 'Simulate Payment'}
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="panel empty">No payments yet. Click "Simulate Payment" to create one.</div>
      ) : (
        <div className="panel">
          <table className="payments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Region</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id.slice(0, 8)}...</td>
                  <td>{p.userId}</td>
                  <td>
                    {p.amount.toFixed(2)} {p.currency}
                  </td>
                  <td>
                    <span className={`status status-${p.status.toLowerCase()}`}>{p.status}</span>
                  </td>
                  <td>{p.region}</td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentsPage;
