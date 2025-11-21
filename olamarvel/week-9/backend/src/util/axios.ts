import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

const legacy = axios.create({
    baseURL: process.env.LEGACY_API_URL || 'http://localhost:4000',
    timeout: 3000
});

axiosRetry(legacy, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error: AxiosError) => {
        // retry on network errors or 5xx
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || ((error.response?.status ?? 0) >= 500);
    }
});

export async function fetchLegacyPayments(): Promise<any[]> {
    const res = await legacy.get('/legacy/payments');
    return res.data;
}