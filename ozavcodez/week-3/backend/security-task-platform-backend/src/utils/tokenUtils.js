const jwt = require('jsonwebtoken');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

class TokenUtils {
  static generateAccessToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  }

  static verifyRefreshToken(token) {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  }

  static decodeToken(token) {
    return jwt.decode(token);
  }

  static async blacklistToken(redisClient, token) {
    const decoded = this.decodeToken(token);
    if (decoded && decoded.exp) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redisClient.set(`blacklist:${token}`, '1');
        await redisClient.expire(`blacklist:${token}`, ttl);
      }
    }
  }

  static async isTokenBlacklisted(redisClient, token) {
    const result = await redisClient.get(`blacklist:${token}`);
    return result !== null;
  }
}

module.exports = TokenUtils;
