export type Currency = 'USD' | 'EUR' | 'NGN';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  region: string;
  createdAt: string;
}

export interface CreatePaymentInput {
  userId: string;
  amount: number;
  currency: Currency;
  region: string;
}

export interface PaymentStats {
  totalVolume: number;
  totalCount: number;
  byStatus: Record<PaymentStatus, number>;
}
