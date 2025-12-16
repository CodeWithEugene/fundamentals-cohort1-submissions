import axios from 'axios';

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'NGN';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  region: string;
  createdAt: string;
}

export interface PaymentStats {
  totalVolume: number;
  totalCount: number;
  byStatus: {
    PENDING: number;
    COMPLETED: number;
    FAILED: number;
  };
}

const client = axios.create({
  baseURL: '/api',
});

export async function createPayment(payload: {
  userId: string;
  amount: number;
  currency: Payment['currency'];
  region: string;
}): Promise<Payment> {
  const { data } = await client.post<Payment>('/payments', payload);
  return data;
}

export async function getPayments(params?: { userId?: string; region?: string }): Promise<Payment[]> {
  const { data } = await client.get<{ payments: Payment[] }>('/payments', { params });
  return data.payments;
}

export async function getStats(): Promise<{ stats: PaymentStats; cached: boolean }> {
  const { data } = await client.get<{ stats: PaymentStats; cached: boolean }>('/payments/stats');
  return data;
}
