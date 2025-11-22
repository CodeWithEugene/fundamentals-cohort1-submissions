import request from 'supertest';
import app from '../index';
import { _testing_reset } from '../controllers/authController';

describe('Auth flow', () => {
  beforeEach(() => {
    _testing_reset();
  });

  it('signup returns token and sets refresh cookie', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: 'alice@example.com', password: 'password123', name: 'Alice' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    const setCookie = res.headers['set-cookie'] || [];
    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie as string];
    expect(cookieArray.length).toBeGreaterThan(0);
    // refreshToken cookie should be present
    expect(cookieArray.join(';')).toContain('refreshToken=');
  });

  it('login returns token and sets refresh cookie', async () => {
    // signup first
    await request(app)
      .post('/auth/signup')
      .send({ email: 'bob@example.com', password: 'secret', name: 'Bob' });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'bob@example.com', password: 'secret' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    const setCookie = res.headers['set-cookie'] || [];
    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie as string];
    expect(cookieArray.length).toBeGreaterThan(0);
    expect(cookieArray.join(';')).toContain('refreshToken=');
  });

  it('refresh rotates refresh token and returns new access token', async () => {
    const signup = await request(app)
      .post('/auth/signup')
      .send({ email: 'carol@example.com', password: 'pw', name: 'Carol' });

    const cookies = signup.headers['set-cookie'] || [];
    const cookieArray = Array.isArray(cookies) ? cookies : [cookies as string];
    expect(cookieArray.length).toBeGreaterThan(0);

    const refreshRes = await request(app)
      .post('/auth/refresh')
      .set('Cookie', cookieArray)
      .send();

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body).toHaveProperty('token');
    const newCookies = refreshRes.headers['set-cookie'] || [];
    const newCookieArray = Array.isArray(newCookies) ? newCookies : [newCookies as string];
    expect(newCookieArray.length).toBeGreaterThan(0);
    expect(newCookieArray.join(';')).toContain('refreshToken=');
  });

  it('logout clears refresh cookie and invalidates refresh token', async () => {
    const signup = await request(app)
      .post('/auth/signup')
      .send({ email: 'dan@example.com', password: 'pw2', name: 'Dan' });

    const cookies = signup.headers['set-cookie'] || [];
    const cookieArray = Array.isArray(cookies) ? cookies : [cookies as string];

    const logout = await request(app)
      .post('/auth/logout')
      .set('Cookie', cookieArray)
      .send();

    expect(logout.status).toBe(204);

    // subsequent refresh should fail
    const refreshRes = await request(app)
      .post('/auth/refresh')
      .set('Cookie', cookieArray)
      .send();

    expect(refreshRes.status).toBe(401);
  });

  it('protected /auth/me requires valid access token', async () => {
    const signup = await request(app)
      .post('/auth/signup')
      .send({ email: 'ellen@example.com', password: 'pw3', name: 'Ellen' });

    const token = signup.body.token;
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('ellen@example.com');
  });
});
