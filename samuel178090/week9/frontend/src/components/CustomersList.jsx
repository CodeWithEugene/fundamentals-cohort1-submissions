import React, { useState, useEffect } from 'react';
import { fetchCustomers, sendNotification } from '../services/api';
import CreateCustomer from './CreateCustomer';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manualCustomers, setManualCustomers] = useState([]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await fetchCustomers();
        setCustomers(data.data || []);
      } catch (err) {
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  if (loading) return <div className="loading">Loading customers...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleCustomerCreated = (newCustomer) => {
    setManualCustomers(prev => [newCustomer, ...prev]);
  };

  const allCustomers = [...manualCustomers, ...customers];

  return (
    <div>
      <CreateCustomer onCustomerCreated={handleCustomerCreated} />
      <h2>Modern Customers (Transformed from Legacy)</h2>
      <div className="grid">
        {allCustomers.map(customer => (
          <div key={customer.id} className="card">
            <h3>{customer.name}</h3>
            <p><strong>Customer ID:</strong> {customer.id}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>
            <p><strong>Invoice Prefix:</strong> {customer.invoice_prefix}</p>
            <p><strong>Delinquent:</strong> 
              <span className={`status ${customer.delinquent ? 'inactive' : 'active'}`}>
                {customer.delinquent ? 'Yes' : 'No'}
              </span>
            </p>
            <p><strong>Tax Exempt:</strong> {customer.tax_exempt}</p>
            <p><strong>Created:</strong> {new Date(customer.created * 1000).toLocaleDateString()}</p>
            <p><strong>Legacy Username:</strong> {customer.metadata.legacy_username}</p>
            <p><strong>Website:</strong> {customer.metadata.website}</p>
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={async () => {
                try {
                  const res = await sendNotification({
                    type: 'customer_update',
                    recipient: customer.email,
                    message: `Customer ${customer.name} notification`,
                    payment_id: customer.id
                  });
                  alert(`Notification sent: ${res.data.id}`);
                } catch (err) {
                  alert('Notify failed');
                }
              }}>Notify</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomersList;