import axios, { AxiosResponse } from 'axios';
import NodeCache from 'node-cache';
import { LegacyPayment, LegacyUser, ModernPayment, ModernCustomer } from '../types';

class LegacyService {
  private cache: NodeCache;
  private baseURL: string;
  private retryAttempts = 3;
  private timeout = 5000;

  constructor() {
    this.cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL || '300') });
    this.baseURL = process.env.LEGACY_API_URL || 'https://jsonplaceholder.typicode.com';
  }

  private async retryRequest<T>(fn: () => Promise<AxiosResponse<T>>, attempts = this.retryAttempts): Promise<T> {
    try {
      const response = await fn();
      return response.data;
    } catch (error) {
      if (attempts > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.retryRequest(fn, attempts - 1);
      }
      throw error;
    }
  }

  async getLegacyPayments(): Promise<LegacyPayment[]> {
    const cacheKey = 'legacy_payments';
    const cached = this.cache.get<LegacyPayment[]>(cacheKey);
    
    if (cached) return cached;

    const data = await this.retryRequest(() => 
      axios.get<LegacyPayment[]>(`${this.baseURL}/posts`, { timeout: this.timeout })
    );

    this.cache.set(cacheKey, data);
    return data;
  }

  async getLegacyUsers(): Promise<LegacyUser[]> {
    const cacheKey = 'legacy_users';
    const cached = this.cache.get<LegacyUser[]>(cacheKey);
    
    if (cached) return cached;

    const data = await this.retryRequest(() => 
      axios.get<LegacyUser[]>(`${this.baseURL}/users`, { timeout: this.timeout })
    );

    this.cache.set(cacheKey, data);
    return data;
  }

  transformToModernPayments(legacyPayments: LegacyPayment[]): ModernPayment[] {
    return legacyPayments.map(payment => {
      const amount = this.extractAmountFromTitle(payment.title);
      const status = this.determinePaymentStatus(payment.id);
      
      return {
        id: `pi_${payment.id.toString().padStart(24, '0')}`,
        object: 'payment_intent',
        amount: amount,
        amount_capturable: 0,
        amount_received: status === 'succeeded' ? amount : 0,
        currency: 'ngn',
        status: status,
        description: payment.title,
        customer: `cus_${payment.userId.toString().padStart(14, '0')}`,
        payment_method: `pm_${Math.random().toString(36).substr(2, 24)}`,
        created: Math.floor(Date.now() / 1000) - (payment.id * 3600),
        metadata: {
          legacy_id: payment.id.toString(),
          source: 'legacy_system',
          transformed_at: new Date().toISOString()
        }
      };
    });
  }

  private extractAmountFromTitle(title: string): number {
    // Extract amount from title or generate realistic amount
    const amounts = [2999, 4999, 9999, 19999, 49999, 99999]; // in cents
    return amounts[Math.floor(Math.random() * amounts.length)];
  }

  private determinePaymentStatus(id: number): 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled' {
    const statuses: Array<'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled'> = [
      'succeeded', 'succeeded', 'succeeded', 'processing', 'requires_confirmation', 'canceled'
    ];
    return statuses[id % statuses.length];
  }

  transformToModernCustomers(legacyUsers: LegacyUser[]): ModernCustomer[] {
    return legacyUsers.map(user => ({
      id: `cus_${user.id.toString().padStart(14, '0')}`,
      object: 'customer',
      name: user.name,
      email: user.email,
      phone: user.phone,
      created: Math.floor(Date.now() / 1000) - (user.id * 86400),
      default_source: null,
      delinquent: false,
      description: `Customer migrated from legacy system`,
      discount: null,
      invoice_prefix: user.username.substring(0, 3).toUpperCase(),
      livemode: false,
      metadata: {
        legacy_user_id: user.id.toString(),
        legacy_username: user.username,
        website: user.website,
        migrated_at: new Date().toISOString()
      },
      shipping: null,
      tax_exempt: 'none'
    }));
  }

  // Testing helper: clear internal cache
  public resetCache() {
    this.cache.flushAll();
  }
}

export default new LegacyService();