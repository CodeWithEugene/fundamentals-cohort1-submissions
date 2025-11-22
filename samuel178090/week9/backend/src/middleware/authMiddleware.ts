import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export interface AuthedRequest extends Request {
  auth?: { sub: string; email?: string };
}

export const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: 'missing_token' });
  const token = m[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.auth = { sub: payload.sub, email: payload.email };
    (req as any).user = { sub: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token' });
  }
};

export default requireAuth;
