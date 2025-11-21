
export function transformPayment(legacy: Legacy) {
    return {
        id: legacy.pay_id,
        amount: typeof legacy.amt_cents === 'number' ? legacy.amt_cents / 100 : parseFloat(legacy.amount || '0'),
        customerId: legacy.cust?.id || legacy.customer_id,
        customerName: legacy.cust?.fullname || 'Unknown',
        timestamp: new Date((legacy.timestamp || legacy.time || Date.now() / 1000) * 1000).toISOString()
    };
}
