
import axios from '@/lib/axios';
import type { Legacy, HealthCheckResponse, Transformed } from '../type.d';

/**
 * Hits the backend health-check endpoint.
 * @returns server health status
 */
export const healthCheck = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await axios.get<HealthCheckResponse>('/health-check');
    return response.data;
  } catch (error: any) {
    console.error('Health check failed:', error.response?.data || error.message);
    return {
      status: 'down',
      uptime: 0,
      version: 'unknown',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    };
  }
};


export const fetchLegacyPayment = async (): Promise<Legacy> => {
  try {
    const response = await axios.get<Legacy>('/api/v1/payments');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching legacy payment:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchTransformedPayment = async (): Promise<Transformed> => {
  try {
    const response = await axios.get<Transformed>('/api/v2/payments');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching transformed payment:', error.response?.data || error.message);
    throw error;
  }
};
