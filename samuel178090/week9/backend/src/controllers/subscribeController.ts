import { Request, Response } from 'express';
import legacyService from '../services/legacyService';

// Simple demo endpoint to 'subscribe' a user to a plan. Returns a created customer object.
export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email, name, plan, amount } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email_required' });

    // Create subscription record
    const subscription = {
      id: `sub_${Math.random().toString(36).substr(2, 24)}`,
      object: 'subscription',
      customer: `cus_${Math.random().toString(36).substr(2, 14)}`,
      plan: plan || 'starter',
      amount: amount || 0,
      currency: 'ngn',
      status: 'active',
      created: Math.floor(Date.now() / 1000),
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      metadata: {
        customer_email: email,
        customer_name: name,
        plan_name: plan
      }
    };

    // Create customer object
    const fakeLegacyUser = [{ id: Math.floor(Math.random() * 100000), name: name || email, username: email.split('@')[0], email, phone: null, website: null }];
    const customers = legacyService.transformToModernCustomers(fakeLegacyUser as any);
    const customer = customers[0];

    res.status(201).json({ 
      success: true, 
      subscription,
      customer,
      message: `Successfully subscribed to ${plan} plan` 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'subscribe_failed' });
  }
};

export default { subscribe };
