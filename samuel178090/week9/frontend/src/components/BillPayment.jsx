import React, { useState } from 'react';

const BillPayment = ({ onPaymentComplete }) => {
  const [formData, setFormData] = useState({
    billType: 'electricity',
    provider: '',
    accountNumber: '',
    amount: '',
    pin: ''
  });
  const [loading, setLoading] = useState(false);

  const billProviders = {
    electricity: ['AEDC', 'EKEDC', 'IKEDC', 'PHED'],
    internet: ['MTN', 'Airtel', 'Glo', '9mobile'],
    cable: ['DSTV', 'GOTV', 'Startimes'],
    water: ['Lagos Water', 'Abuja Water', 'Kano Water']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { payBill } = await import('../services/api');
      const result = await payBill({
        billType: formData.billType,
        provider: formData.provider,
        accountNumber: formData.accountNumber,
        amount: formData.amount,
        pin: formData.pin
      });
      
      onPaymentComplete(result.data);
      setFormData({ billType: 'electricity', provider: '', accountNumber: '', amount: '', pin: '' });
      alert(`✅ ${result.message}! Reference: ${result.data.reference}`);
    } catch (error) {
      alert(`❌ ${error.response?.data?.error || 'Bill payment failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>💡 Pay Bills</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label>Bill Type:</label>
          <select
            value={formData.billType}
            onChange={(e) => setFormData({...formData, billType: e.target.value, provider: ''})}
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          >
            <option value="electricity">Electricity</option>
            <option value="internet">Internet</option>
            <option value="cable">Cable TV</option>
            <option value="water">Water</option>
          </select>
        </div>
        
        <div>
          <label>Provider:</label>
          <select
            value={formData.provider}
            onChange={(e) => setFormData({...formData, provider: e.target.value})}
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          >
            <option value="">Select Provider</option>
            {billProviders[formData.billType]?.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Account/Meter Number:</label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
            placeholder="Enter account number"
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
            min="500"
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
            placeholder="Enter PIN"
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
          {loading ? 'Processing Payment...' : `Pay ₦${formData.amount || '0'}`}
        </button>
      </form>
    </div>
  );
};

export default BillPayment;