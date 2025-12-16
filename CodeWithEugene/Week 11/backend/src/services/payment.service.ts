import { v4 as uuidv4 } from 'uuid';
import { CreatePaymentInput, Payment, PaymentStats, PaymentStatus } from '../types/payment';

// This layer is intentionally SQL-oriented (row-based records, aggregate queries)
// even though we use in-memory storage for the PoC.

const payments: Payment[] = [];

export class PaymentService {
  createPayment(input: CreatePaymentInput): Payment {
    const payment: Payment = {
      id: uuidv4(),
      userId: input.userId,
      amount: input.amount,
      currency: input.currency,
      region: input.region,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    payments.push(payment);
    return payment;
  }

  listPayments(userId?: string, region?: string): Payment[] {
    return payments.filter((p) => {
      if (userId && p.userId !== userId) return false;
      if (region && p.region !== region) return false;
      return true;
    });
  }

  updatePaymentStatus(id: string, status: PaymentStatus): Payment | null {
    const payment = payments.find((p) => p.id === id);
    if (!payment) return null;
    payment.status = status;
    return payment;
  }

  computeStats(): PaymentStats {
    const byStatus: PaymentStats['byStatus'] = {
      PENDING: 0,
      COMPLETED: 0,
      FAILED: 0,
    };

    let totalVolume = 0;

    for (const p of payments) {
      totalVolume += p.amount;
      byStatus[p.status] += 1;
    }

    return {
      totalVolume,
      totalCount: payments.length,
      byStatus,
    };
  }
}

export const paymentService = new PaymentService();
