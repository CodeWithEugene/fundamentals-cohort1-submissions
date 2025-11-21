import request from 'supertest';
import { app } from '../../src/index';

describe('GET /v2/payments', () => {
    it('returns transformed payments', async () => {
        const res = await request(app).get('/api/v2/payments');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);

        const firstPayment = res.body.data[0];
        expect(firstPayment).toHaveProperty('id');
        expect(typeof firstPayment.id).toBe('string');
        expect(firstPayment).toHaveProperty('amount');
        expect(typeof firstPayment.amount).toBe('number');
        expect(firstPayment).toHaveProperty('customerId');
        expect(typeof firstPayment.customerId).toBe('string');
        expect(firstPayment).toHaveProperty('customerName');
        expect(typeof firstPayment.customerName).toBe('string');
        expect(firstPayment).toHaveProperty('timestamp');
        expect(typeof firstPayment.timestamp).toBe('string');
        expect(() => new Date(firstPayment.timestamp).toISOString()).not.toThrow();
    });
});
