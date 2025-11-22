import legacyService from '../services/legacyService';
import axios from 'axios';
import request from 'supertest';
import app from '../index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LegacyService and controllers', () => {
  afterEach(() => {
    jest.resetAllMocks();
    legacyService.resetCache();
  });

  it('transforms legacy payments and customers to modern shape', () => {
    const legacyPayments = [
      { id: 1, userId: 2, title: 'Order #1', body: '...' },
    ];
    const modern = legacyService.transformToModernPayments(legacyPayments as any);
    expect(modern.length).toBe(1);
    expect(modern[0].id).toMatch(/^pi_/);
    expect(modern[0].customer).toMatch(/^cus_/);

    const legacyUsers = [
      { id: 3, name: 'Test User', username: 'test', email: 't@example.com', phone: '123', website: 'example.com' },
    ];
    const customers = legacyService.transformToModernCustomers(legacyUsers as any);
    expect(customers.length).toBe(1);
    expect(customers[0].id).toMatch(/^cus_/);
    expect(customers[0].metadata.legacy_username).toBe('test');
  });

  it('caches legacy payments and only calls axios once', async () => {
    const sample = [{ id: 10, userId: 4, title: 'X', body: '' }];
    mockedAxios.get.mockResolvedValue({ data: sample } as any);

    const a = await legacyService.getLegacyPayments();
    const b = await legacyService.getLegacyPayments();

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(a).toEqual(sample);
    expect(b).toEqual(sample);
  });

  it('GET /v2/payments returns transformed data and meta', async () => {
    const sample = [{ id: 5, userId: 7, title: 'Order', body: '' }];
    mockedAxios.get.mockResolvedValue({ data: sample } as any);

    const res = await request(app).get('/v2/payments');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
    expect(res.body.meta.version).toBe('v2');
  });

  it('GET /v2/customers returns transformed data and meta', async () => {
    const sample = [ { id: 8, name: 'X', username: 'x', email: 'x@x.com', phone: '', website: '' } ];
    // axios.get will be called for users endpoint
    mockedAxios.get.mockResolvedValue({ data: sample } as any);

    const res = await request(app).get('/v2/customers');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.meta.version).toBe('v2');
  });

  it('POST /v2/payments/:id/refund returns refunded payment', async () => {
    const sample = [{ id: 21, userId: 7, title: 'Order', body: '' }];
    mockedAxios.get.mockResolvedValue({ data: sample } as any);

    // first fetch payments to generate id
    const paymentsRes = await request(app).get('/v2/payments');
    const payment = paymentsRes.body.data[0];

    const refundRes = await request(app).post(`/v2/payments/${payment.id}/refund`).send();
    expect(refundRes.status).toBe(200);
    expect(refundRes.body).toHaveProperty('success', true);
    expect(refundRes.body.data.status).toBe('canceled');
  });

  it('POST /v2/customers/:id/notify returns queued message', async () => {
    const sample = [ { id: 8, name: 'X', username: 'x', email: 'x@x.com', phone: '', website: '' } ];
    mockedAxios.get.mockResolvedValue({ data: sample } as any);

    const customersRes = await request(app).get('/v2/customers');
    const cust = customersRes.body.data[0];

    const notifyRes = await request(app).post(`/v2/customers/${cust.id}/notify`).send();
    expect(notifyRes.status).toBe(200);
    expect(notifyRes.body).toHaveProperty('success', true);
  });
});
