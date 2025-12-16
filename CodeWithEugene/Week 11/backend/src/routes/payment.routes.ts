import { Router } from 'express';
import {
  createPayment,
  listPayments,
  updatePaymentStatus,
  getPaymentStats,
} from '../controllers/payment.controller';

const router = Router();

// REST-style endpoints demonstrating trade-offs
router.post('/payments', createPayment);
router.get('/payments', listPayments);
router.patch('/payments/:id/status', updatePaymentStatus);
router.get('/payments/stats', getPaymentStats);

export default router;
