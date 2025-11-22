import React, { useState } from 'react';

const CreateCustomer = ({ onCustomerCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate customer creation
      const newCustomer = {
        id: `cus_${Date.now()}`,
        object: 'customer',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        created: Math.floor(Date.now() / 1000),
        default_source: null,
        delinquent: false,
        description: `Customer created manually`,
        discount: null,
        invoice_prefix: formData.name.substring(0, 3).toUpperCase(),
        livemode: false,
        metadata: {
          legacy_user_id: Date.now().toString(),
          legacy_username: formData.email.split('@')[0],
          website: formData.website,
          migrated_at: new Date().toISOString()
        },
        shipping: null,
        tax_exempt: 'none'
      };
      
      onCustomerCreated(newCustomer);
      setFormData({ name: '', email: '', phone: '', website: '' });
      alert('Customer created successfully!');
    } catch (error) {
      alert('Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h3>Create New Customer</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter customer name"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="customer@example.com"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+234 xxx xxx xxxx"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <div>
          <label>Website (optional):</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
            placeholder="https://example.com"
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{ alignSelf: 'flex-start' }}
        >
          {loading ? 'Creating...' : 'Create Customer'}
        </button>
      </form>
    </div>
  );
};

export default CreateCustomer;