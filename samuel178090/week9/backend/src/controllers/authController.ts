import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as db from '../services/db';

function makeId(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 10);
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

function signToken(payload: object) {
  return jwt.sign(payload as any, JWT_SECRET as any, { expiresIn: JWT_EXPIRES_IN } as any);
}

function signRefreshToken(payload: object, jti: string, expiresIn = '7d') {
  return jwt.sign({ ...(payload as any), type: 'refresh', jti } as any, JWT_SECRET as any, { expiresIn } as any);
}

function setRefreshCookie(res: any, token: string, maxAge = 7 * 24 * 60 * 60 * 1000) {
  const secure = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export const signup = async (req: Request, res: Response) => {
  try {
    // Add CORS headers
    res.header('Access-Control-Allow-Credentials', 'true');
    
    const { email, password, name, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    // reject duplicate
    const existing = db.getUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'user_exists' });

    const id = makeId('u_');
    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role || (email.includes('admin') || email === 'sam@example.com' ? 'admin' : 'user');
    db.createUser({ id, email, passwordHash, name, role: userRole });

    const token = signToken({ sub: id, email });
    // create refresh token and store mapping
    const jti = makeId('r_');
    const refresh = signRefreshToken({ sub: id, email }, jti);
    db.createRefreshToken(jti, id);
    setRefreshCookie(res, refresh);

    res.json({ token, user: { id, email, name, role: userRole } });
  } catch (err) {
    console.error('signup error', err);
    res.status(500).json({ error: 'server_error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Add CORS headers
    res.header('Access-Control-Allow-Credentials', 'true');
    
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const u: any = db.getUserByEmail(email);
    if (!u) return res.status(401).json({ error: 'invalid_credentials' });

    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

    const token = signToken({ sub: u.id, email: u.email });
    // create refresh token and set cookie
    const jti = makeId('r_');
    const refresh = signRefreshToken({ sub: u.id, email: u.email }, jti);
    db.createRefreshToken(jti, u.id);
    setRefreshCookie(res, refresh);

    return res.json({ token, user: { id: u.id, email: u.email, name: u.name, role: u.role || 'user' } });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'server_error' });
  }
};

export const me = (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization || '';
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (!m) return res.status(401).json({ error: 'missing_token' });
    const token = m[1];

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET) as any;
    } catch (err) {
      return res.status(401).json({ error: 'invalid_token' });
    }

    const userId = payload.sub;
    const user = db.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'user_not_found' });

    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('me error', err);
    res.status(500).json({ error: 'server_error' });
  }
};

export const refresh = (req: Request, res: Response) => {
  try {
    const token = (req as any).cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: 'missing_refresh' });

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET) as any;
    } catch (err) {
      return res.status(401).json({ error: 'invalid_refresh' });
    }

    if (payload.type !== 'refresh' || !payload.jti) return res.status(401).json({ error: 'invalid_refresh' });
    const jti = payload.jti;
    const userId = db.getRefreshUserId(jti);
    if (!userId) return res.status(401).json({ error: 'invalid_refresh' });

    // rotate refresh token
    db.deleteRefresh(jti);
    const newJti = makeId('r_');
    const refreshToken = signRefreshToken({ sub: userId, email: payload.email }, newJti);
    db.createRefreshToken(newJti, userId);
    setRefreshCookie(res, refreshToken);

    const access = signToken({ sub: userId, email: payload.email });
    return res.json({ token: access });
  } catch (err) {
    console.error('refresh error', err);
    return res.status(500).json({ error: 'server_error' });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    const token = (req as any).cookies?.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        if (payload && payload.jti) db.deleteRefresh(payload.jti);
      } catch (err) {
        // ignore
      }
    }
    // clear cookie
    res.clearCookie('refreshToken', { path: '/' });
    return res.status(204).send('');
  } catch (err) {
    console.error('logout error', err);
    return res.status(500).json({ error: 'server_error' });
  }
};

// Testing helper to reset persistent stores
export const _testing_reset = () => {
  db.resetDatabase();
};
