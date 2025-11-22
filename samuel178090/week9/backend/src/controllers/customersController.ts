import { Request, Response } from 'express';
import legacyService from '../services/legacyService';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const legacyUsers = await legacyService.getLegacyUsers();
    const modernCustomers = legacyService.transformToModernCustomers(legacyUsers);
    
    res.json({
      success: true,
      data: modernCustomers,
      meta: {
        total: modernCustomers.length,
        version: 'v2'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const legacyUsers = await legacyService.getLegacyUsers();
    const modernCustomers = legacyService.transformToModernCustomers(legacyUsers);
    
    const customer = modernCustomers.find(c => c.id === id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const notifyCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const legacyUsers = await legacyService.getLegacyUsers();
    const modernCustomers = legacyService.transformToModernCustomers(legacyUsers);
    const customer = modernCustomers.find(c => c.id === id);

    if (!customer) return res.status(404).json({ success: false, error: 'Customer not found' });

    // Simulate notification (no-op)
    return res.json({ success: true, message: `Notification queued for ${customer.email || customer.name}` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to notify customer' });
  }
};