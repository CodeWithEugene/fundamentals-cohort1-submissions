import React, { useState } from 'react';

const CreatePayment = ({ onPaymentCreated }) => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'ngn',
    description: '',
    customerEmail: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate payment creation
      const newPayment = {
        id: `pi_${Date.now()}`,
        object: 'payment_intent',
        amount: parseInt(formData.amount) * 100, // Convert to kobo
        currency: formData.currency,
        status: 'succeeded',
        description: formData.description,
        customer: `cus_${Date.now()}`,
        payment_method: `pm_${Math.random().toString(36).substr(2, 24)}`,
        created: Math.floor(Date.now() / 1000),
        amount_received: parseInt(formData.amount) * 100,
        metadata: {
          legacy_id: Date.now().toString(),
          source: 'manual_entry',
          customer_email: formData.customerEmail
        }
      };
      
      onPaymentCreated(newPayment);
      setFormData({ amount: '', currency: 'ngn', description: '', customerEmail: '' });
      alert('Payment created successfully!');
    } catch (error) {
      alert('Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h3>Create New Payment</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label>Amount (₦):</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder="Enter amount in Naira"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Payment description"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <div>
          <label>Customer Email:</label>
          <input
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
            placeholder="customer@example.com"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{ alignSelf: 'flex-start' }}
        >
          {loading ? 'Creating...' : 'Create Payment'}
        </button>
      </form>
    </div>
  );
};

export default CreatePayment;