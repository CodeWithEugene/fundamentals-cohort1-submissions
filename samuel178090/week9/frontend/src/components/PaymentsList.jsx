import React, { useState, useEffect } from 'react';
import { fetchPayments, refundPayment, sendNotification } from '../services/api';
import CreatePayment from './CreatePayment';

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manualPayments, setManualPayments] = useState([]);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const data = await fetchPayments();
        setPayments(data.data || []);
      } catch (err) {
        setError('Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  if (loading) return <div className="loading">Loading payments...</div>;
  if (error) return <div className="error">{error}</div>;

  const handlePaymentCreated = (newPayment) => {
    setManualPayments(prev => [newPayment, ...prev]);
  };

  const allPayments = [...manualPayments, ...payments];

  return (
    <div>
      <CreatePayment onPaymentCreated={handlePaymentCreated} />
      <h2>Modern Payments (Transformed from Legacy)</h2>
      <div className="grid">
        {allPayments.map(payment => (
          <div key={payment.id} className="card">
            <h3>{payment.description}</h3>
            <p><strong>Payment ID:</strong> {payment.id}</p>
            <p><strong>Customer:</strong> {payment.customer}</p>
            <p><strong>Amount:</strong> {`₦${(payment.amount / 100).toFixed(2)}`}</p>
            <p><strong>Amount Received:</strong> {`₦${(payment.amount_received / 100).toFixed(2)}`}</p>
            <p><strong>Status:</strong> 
              <span className={`status ${payment.status}`}>{payment.status.replace('_', ' ')}</span>
            </p>
            <p><strong>Payment Method:</strong> {payment.payment_method}</p>
            <p><strong>Created:</strong> {new Date(payment.created * 1000).toLocaleDateString()}</p>
            <p><strong>Legacy ID:</strong> {payment.metadata.legacy_id}</p>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" onClick={async () => {
                try {
                  const res = await refundPayment(payment.id);
                  alert(`Refunded ${payment.id}: status=${res.data.status}`);
                } catch (err) {
                  alert('Refund failed');
                }
              }}>Refund</button>
              <button className="btn btn-ghost" onClick={async () => {
                try {
                  const res = await sendNotification({
                    type: 'payment_update',
                    recipient: 'customer@example.com',
                    message: `Payment ${payment.id} notification`,
                    payment_id: payment.id
                  });
                  alert(`Notification sent: ${res.data.id}`);
                } catch (err) {
                  alert('Notification failed');
                }
              }}>Notify</button>
            </div>
          </div>
        ))}
      </div>
          <div style={{ marginTop: 12 }}>
            <small>All amounts shown in NGN (₦)</small>
          </div>
    </div>
  );
};

export default PaymentsList;