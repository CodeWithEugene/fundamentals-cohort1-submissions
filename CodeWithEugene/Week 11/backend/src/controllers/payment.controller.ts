import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service';
import { cache } from '../services/cache.service';
import { CreatePaymentInput, PaymentStatus } from '../types/payment';

export const createPayment = (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<CreatePaymentInput>;

    if (!body.userId || !body.amount || !body.currency || !body.region) {
      return res.status(400).json({
        error: 'Missing required fields: userId, amount, currency, region',
      });
    }

    const payment = paymentService.createPayment({
      userId: body.userId,
      amount: Number(body.amount),
      currency: body.currency,
      region: body.region,
    });

    // Invalidate cached stats when a new payment is created
    cache.clear();

    return res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listPayments = (req: Request, res: Response) => {
  try {
    const { userId, region } = req.query;
    const payments = paymentService.listPayments(
      typeof userId === 'string' ? userId : undefined,
      typeof region === 'string' ? region : undefined
    );

    return res.json({ payments });
  } catch (error) {
    console.error('Error listing payments', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePaymentStatus = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status?: PaymentStatus };

    if (!status || !['PENDING', 'COMPLETED', 'FAILED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing status' });
    }

    const payment = paymentService.updatePaymentStatus(id, status);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    cache.clear();

    return res.json(payment);
  } catch (error) {
    console.error('Error updating payment status', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPaymentStats = (req: Request, res: Response) => {
  try {
    const cacheKey = 'payment-stats';
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ stats: cached, cached: true });
    }

    const stats = paymentService.computeStats();
    cache.set(cacheKey, stats);

    return res.json({ stats, cached: false });
  } catch (error) {
    console.error('Error computing payment stats', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
