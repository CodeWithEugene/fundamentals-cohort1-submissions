import client from 'prom-client';

const register = new client.Registry();

// Default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const deploymentCounter = new client.Counter({
  name: 'deployments_total',
  help: 'Total number of deployments',
  labelNames: ['service', 'status'],
  registers: [register],
});

export const systemMetrics = new client.Gauge({
  name: 'system_metrics',
  help: 'System resource metrics',
  labelNames: ['metric_type'],
  registers: [register],
});

export function initMetrics() {
  // Update system metrics every 10 seconds
  setInterval(() => {
    const memUsage = process.memoryUsage();
    systemMetrics.set({ metric_type: 'memory_mb' }, memUsage.heapUsed / 1024 / 1024);
    systemMetrics.set({ metric_type: 'rss_mb' }, memUsage.rss / 1024 / 1024);
  }, 10000);
}

export function getMetricsText() {
  return register.metrics();
}
