import { Request, Response } from 'express';
import legacyService from '../services/legacyService';

export const getPayments = async (req: Request, res: Response) => {
  try {
    const legacyPayments = await legacyService.getLegacyPayments();
    const modernPayments = legacyService.transformToModernPayments(legacyPayments);
    
    res.json({
      success: true,
      data: modernPayments,
      meta: {
        total: modernPayments.length,
        version: 'v2'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const legacyPayments = await legacyService.getLegacyPayments();
    const modernPayments = legacyService.transformToModernPayments(legacyPayments);
    
    const payment = modernPayments.find(p => p.id === id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const legacyPayments = await legacyService.getLegacyPayments();
    const modernPayments = legacyService.transformToModernPayments(legacyPayments);
    const payment = modernPayments.find(p => p.id === id);

    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });

    // Simulate refund: set status to 'canceled' and amount_received to 0
    const refunded = { ...payment, status: 'canceled', amount_received: 0 };
    return res.json({ success: true, data: refunded });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to refund payment' });
  }
};