import legacyService from './legacyService';
import { LegacyPayment, LegacyUser } from '../types';

describe('LegacyService', () => {
  const mockLegacyPayments: LegacyPayment[] = [
    { id: 1, userId: 1, title: 'Test Payment', body: 'Test description' }
  ];

  const mockLegacyUsers: LegacyUser[] = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phone: '123-456-7890',
      website: 'johndoe.com'
    }
  ];

  describe('transformToModernPayments', () => {
    it('should transform legacy payments to modern format', () => {
      const result = legacyService.transformToModernPayments(mockLegacyPayments);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'pay_1',
        customerId: 'cust_1',
        description: 'Test Payment',
        currency: 'USD'
      });
      expect(result[0].amount).toBeGreaterThan(0);
      expect(['pending', 'completed', 'failed']).toContain(result[0].status);
    });
  });

  describe('transformToModernCustomers', () => {
    it('should transform legacy users to modern customers', () => {
      const result = legacyService.transformToModernCustomers(mockLegacyUsers);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'cust_1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890'
      });
      expect(['active', 'inactive']).toContain(result[0].status);
    });
  });
});