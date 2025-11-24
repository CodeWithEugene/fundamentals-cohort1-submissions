// Shared API types - should be documented for frontend team
export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  message: string;
}

export interface SystemMetrics {
  memoryUsage: number;
  memoryLimit: number;
  cpuUsage: number;
  nodeVersion: string;
}

export interface Deployment {
  id: string;
  name: string;
  status: 'success' | 'failed' | 'in-progress';
  timestamp: string;
  duration: number;
}

export interface DeploymentsResponse {
  success: true;
  data: Deployment[];
  timestamp: string;
}

export interface MetricsResponse {
  success: true;
  data: SystemMetrics;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: string;
}
