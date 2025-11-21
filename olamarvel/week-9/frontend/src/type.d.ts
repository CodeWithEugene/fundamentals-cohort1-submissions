export interface HealthCheckResponse {
  status: 'up' | 'down';
  uptime: number;
  version: string;
  timestamp: string;
  error?: string;
}

export interface Legacy {
  data: LegacyPayment[];
}

export interface LegacyPayment {
  pay_id?: string;
  amt_cents?: number | string;
  cust?: { id: string, fullname: string };
  customer_id?: string;
  amount?: string;
  timestamp: number;
  time?: number;
}

export interface Transformed {
  data: TransformedPayment[];
}

export interface TransformedPayment {
  id?: string;
  amount?: number;
  customerId?: string;
  customerName?: string;
  timestamp?: string;
}


export interface HealthCheckResponse {
  status: string;          // "ok" or "down"
  uptime: number;
  version: string;
  timestamp: string;
  error?: string;
}
