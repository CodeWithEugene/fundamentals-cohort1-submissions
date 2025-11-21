import request from 'supertest';
import { app } from '../../src/index';

describe('GET /v1/payments', () => {
    it('returns legacy payments', async () => {
        const res = await request(app).get('/api/v1/payments');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);

        const firstPayment = res.body.data[0];
        expect(firstPayment).toHaveProperty('pay_id');
        expect(typeof firstPayment.pay_id).toBe('string');
        expect(firstPayment).toHaveProperty('amt_cents');
        expect(typeof firstPayment.amt_cents).toBe('number');
        expect(firstPayment).toHaveProperty('cust');
        expect(typeof firstPayment.cust).toBe('object');
        expect(firstPayment.cust).toHaveProperty('id');
        expect(typeof firstPayment.cust.id).toBe('string');
        expect(firstPayment.cust).toHaveProperty('fullname');
        expect(typeof firstPayment.cust.fullname).toBe('string');
        expect(firstPayment).toHaveProperty('timestamp');
        expect(typeof firstPayment.timestamp).toBe('number');
    });
});
