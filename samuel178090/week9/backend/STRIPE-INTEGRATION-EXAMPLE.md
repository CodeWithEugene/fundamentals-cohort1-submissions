# Stripe-like Integration Example

## Overview
This implementation demonstrates how to transform legacy payment data into Stripe-compatible format, showing real-world fintech integration patterns.

## Data Transformation Examples

### Legacy Payment → Stripe Payment Intent

**Before (Legacy System):**
```json
{
  "id": 1,
  "userId": 1,
  "title": "Payment for premium subscription",
  "body": "Monthly subscription payment"
}
```

**After (Stripe-like Format):**
```json
{
  "id": "pi_000000000000000000000001",
  "object": "payment_intent",
  "amount": 2999,
  "amount_capturable": 0,
  "amount_received": 2999,
  "currency": "usd",
  "status": "succeeded",
  "description": "Payment for premium subscription",
  "customer": "cus_00000000000001",
  "payment_method": "pm_1234567890abcdef",
  "created": 1640995200,
  "metadata": {
    "legacy_id": "1",
    "source": "legacy_system",
    "transformed_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Legacy User → Stripe Customer

**Before (Legacy System):**
```json
{
  "id": 1,
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org"
}
```

**After (Stripe-like Format):**
```json
{
  "id": "cus_00000000000001",
  "object": "customer",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1-770-736-8031 x56442",
  "created": 1640908800,
  "default_source": null,
  "delinquent": false,
  "description": "Customer migrated from legacy system",
  "discount": null,
  "invoice_prefix": "JOH",
  "livemode": false,
  "metadata": {
    "legacy_user_id": "1",
    "legacy_username": "johndoe",
    "website": "hildegard.org",
    "migrated_at": "2024-01-15T10:30:00.000Z"
  },
  "shipping": null,
  "tax_exempt": "none"
}
```

## Key Stripe-like Features Implemented

### 1. Payment Intent Structure
- **ID Format**: `pi_` prefix with 24-character identifier
- **Amount in Cents**: Following Stripe's cent-based pricing
- **Status Mapping**: Legacy statuses → Stripe payment intent statuses
- **Metadata Preservation**: Legacy data preserved in metadata

### 2. Customer Structure
- **ID Format**: `cus_` prefix with 14-character identifier
- **Invoice Prefixes**: Generated from customer names
- **Metadata Tracking**: Complete legacy data preservation
- **Stripe Fields**: All standard Stripe customer fields included

### 3. Realistic Payment Amounts
- Amounts in cents (2999 = $29.99)
- Common SaaS pricing tiers
- Proper currency formatting in frontend

### 4. Status Mapping
**Legacy → Stripe Payment Statuses:**
- `completed` → `succeeded`
- `pending` → `processing` or `requires_confirmation`
- `failed` → `requires_payment_method`
- Additional Stripe statuses: `requires_action`, `canceled`

## API Endpoints

### Payment Endpoints
```
GET /v2/payments
GET /v2/payments/:id
```

**Response Format:**
```json
{
  "success": true,
  "data": [/* Stripe-like payment objects */],
  "meta": {
    "total": 100,
    "version": "v2"
  }
}
```

### Customer Endpoints
```
GET /v2/customers
GET /v2/customers/:id
```

## Frontend Display

The React frontend displays:
- **Payment amounts** in dollars (converted from cents)
- **Stripe-style IDs** with proper prefixes
- **Payment statuses** with appropriate styling
- **Legacy metadata** for traceability
- **Customer information** in Stripe format

## Integration Benefits

1. **Familiar Format**: Developers familiar with Stripe can easily work with the API
2. **Migration Path**: Clear path for migrating from legacy to Stripe
3. **Metadata Preservation**: No data loss during transformation
4. **Standard Compliance**: Follows payment industry standards
5. **Scalable Design**: Can handle real Stripe integration later

This implementation serves as a bridge between legacy payment systems and modern payment processors like Stripe, demonstrating enterprise-grade integration patterns.