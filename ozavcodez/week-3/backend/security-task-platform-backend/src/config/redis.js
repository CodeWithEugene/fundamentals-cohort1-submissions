const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('Redis connection refused');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Redis retry time exhausted');
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.on('connect', () => console.log('Redis Client Connected'));

    // Promisify Redis methods
    this.get = promisify(this.client.get).bind(this.client);
    this.set = promisify(this.client.set).bind(this.client);
    this.del = promisify(this.client.del).bind(this.client);
    this.incr = promisify(this.client.incr).bind(this.client);
    this.expire = promisify(this.client.expire).bind(this.client);
    this.ttl = promisify(this.client.ttl).bind(this.client);
  }

  async disconnect() {
    return new Promise((resolve) => {
      this.client.quit(() => resolve());
    });
  }
}

module.exports = RedisClient;
