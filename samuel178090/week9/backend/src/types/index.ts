export interface LegacyPayment {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface ModernPayment {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_received: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  description: string;
  customer: string;
  payment_method: string;
  created: number;
  metadata: {
    legacy_id: string;
    source: string;
    transformed_at: string;
  };
}

export interface LegacyUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface ModernCustomer {
  id: string;
  object: string;
  name: string;
  email: string;
  phone: string;
  created: number;
  default_source: string | null;
  delinquent: boolean;
  description: string;
  discount: any;
  invoice_prefix: string;
  livemode: boolean;
  metadata: {
    legacy_user_id: string;
    legacy_username: string;
    website: string;
    migrated_at: string;
  };
  shipping: any;
  tax_exempt: string;
}