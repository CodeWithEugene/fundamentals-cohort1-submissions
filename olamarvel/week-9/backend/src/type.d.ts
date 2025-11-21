interface Legacy {
    pay_id?: string,
    amt_cents?: number | string,
    cust?: { id: string, fullname: string },
    customer_id?: string,
    amount?: string,
    timestamp: number,
    time?: number,
}