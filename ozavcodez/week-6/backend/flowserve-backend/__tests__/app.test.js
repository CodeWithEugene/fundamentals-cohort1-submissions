const request = require('supertest');
const app = require('../server');

describe('FlowServe API', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      
      expect(res.body.message).toBe('Welcome to FlowServe API');
    });
  });

  describe('GET /api/users', () => {
    it('should return empty users array', async () => {
      const res = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(res.body.users).toBeDefined();
      expect(Array.isArray(res.body.users)).toBe(true);
    });
  });

  describe('GET /api/transactions', () => {
    it('should return empty transactions array', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .expect(200);
      
      expect(res.body.transactions).toBeDefined();
      expect(Array.isArray(res.body.transactions)).toBe(true);
    });
  });
});