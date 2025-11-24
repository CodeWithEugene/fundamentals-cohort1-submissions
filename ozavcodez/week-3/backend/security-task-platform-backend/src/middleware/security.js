class SecurityMiddleware {
  constructor(redisClient) {
    this.redisClient = redisClient;
    this.MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 3;
    this.LOCK_DURATION = parseInt(process.env.LOCK_DURATION) || 1800;
  }

  async checkAccountLock(email) {
    const lockKey = `lock:${email}`;
    const isLocked = await this.redisClient.get(lockKey);
    
    if (isLocked) {
      const ttl = await this.redisClient.ttl(lockKey);
      throw new Error(`Account locked. Try again in ${Math.ceil(ttl / 60)} minutes`);
    }
  }

  async recordFailedLogin(email) {
    const attemptKey = `attempts:${email}`;
    const attempts = await this.redisClient.incr(attemptKey);
    
    if (attempts === 1) {
      await this.redisClient.expire(attemptKey, this.LOCK_DURATION);
    }
    
    if (attempts >= this.MAX_LOGIN_ATTEMPTS) {
      const lockKey = `lock:${email}`;
      await this.redisClient.set(lockKey, '1');
      await this.redisClient.expire(lockKey, this.LOCK_DURATION);
      await this.redisClient.del(attemptKey);
      
      throw new Error(`Account locked due to multiple failed login attempts. Try again in 30 minutes`);
    }
    
    return this.MAX_LOGIN_ATTEMPTS - attempts;
  }

  async resetFailedLogins(email) {
    const attemptKey = `attempts:${email}`;
    await this.redisClient.del(attemptKey);
  }
}

module.exports = SecurityMiddleware;
