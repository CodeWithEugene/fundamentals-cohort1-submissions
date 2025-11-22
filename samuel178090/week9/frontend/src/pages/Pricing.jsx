import React, { useState } from 'react';

const tiers = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 0,
    bullets: ['Basic integrations', 'Sandbox access', 'Community support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    priceMonthly: 25000,
    bullets: ['Multiple processors', 'Webhooks & transforms', 'Email support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 150000,
    bullets: ['SLA & onboarding', 'Dedicated account manager', 'Custom connectors'],
  }
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="pricing container">
      <div className="pricing-header card">
        <h2>Plans built for real integrations</h2>
        <p>Choose a plan based on your scale — switch between monthly and annual billing</p>
        <div className="toggle">
          <label>
            <input type="checkbox" checked={annual} onChange={() => setAnnual(!annual)} />
            <span>Annual billing</span>
          </label>
        </div>
      </div>

      <div className="pricing-grid">
        {tiers.map(t => (
          <div key={t.id} className="pricing-card card">
            <h3>{t.name}</h3>
            <div className="price">
              ₦{annual ? Math.round(t.priceMonthly * 10).toLocaleString() : t.priceMonthly.toLocaleString()}
              <span className="period">/mo</span>
            </div>
            <ul>
              {t.bullets.map(b => <li key={b}>{b}</li>)}
            </ul>
            <PricingCTA tier={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

const PricingCTA = ({ tier }) => {
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  const handleClick = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { subscribe } = await import('../services/api');
      const res = await subscribe({ 
        email: `demo+${tier.id}@example.com`, 
        name: `${tier.name} Plan Subscriber`,
        plan: tier.id,
        amount: tier.priceMonthly
      });
      setMessage(`✓ ${tier.name} plan activated! Check dashboard for details.`);
    } catch (err) {
      setMessage('Subscription failed - please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={handleClick} disabled={loading}>{loading ? 'Processing…' : 'Get started'}</button>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </div>
  );
};

export default Pricing;
