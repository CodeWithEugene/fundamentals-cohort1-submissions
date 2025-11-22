import React, { useState } from 'react';
import { transferMoney } from '../services/api';

const TransferMoney = ({ onTransferComplete }) => {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    amount: '',
    description: '',
    pin: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await transferMoney({
        recipientEmail: formData.recipientEmail,
        amount: formData.amount,
        description: formData.description,
        pin: formData.pin
      });
      
      onTransferComplete(result.data);
      setFormData({ recipientEmail: '', amount: '', description: '', pin: '' });
      alert(`✅ ${result.message}! Reference: ${result.data.reference}`);
    } catch (error) {
      alert(`❌ ${error.response?.data?.error || 'Transfer failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>💸 Send Money</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label>Recipient Email:</label>
          <input
            type="email"
            value={formData.recipientEmail}
            onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
            placeholder="recipient@example.com"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <div>
          <label>Amount (₦):</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder="Enter amount"
            min="100"
            max="500000"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <small style={{ color: '#666' }}>Fee: ₦{formData.amount ? Math.round(parseInt(formData.amount) * 0.015) : 0}</small>
        </div>
        
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="What's this for?"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <div>
          <label>Transaction PIN:</label>
          <input
            type="password"
            value={formData.pin}
            onChange={(e) => setFormData({...formData, pin: e.target.value})}
            placeholder="Enter 4-digit PIN"
            maxLength="4"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <small style={{ color: '#666' }}>Demo PIN: 1234</small>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || formData.pin !== '1234'}
          style={{ alignSelf: 'flex-start' }}
        >
          {loading ? 'Processing Transfer...' : `Send ₦${formData.amount || '0'}`}
        </button>
      </form>
    </div>
  );
};

export default TransferMoney;