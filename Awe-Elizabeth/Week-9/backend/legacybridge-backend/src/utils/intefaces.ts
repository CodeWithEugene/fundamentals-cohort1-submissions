export interface ILegacyPaymentRespose{
    payment_id: number
    customer_name: string
    amount: string
    currency: string
    channel: string
    status: string
    created_at: string
    meta: IMeta
}

interface IMeta {
    legacy_reference: string
    processor: string
    failure_reason: string | null
}

export interface IModernPaymentResponse{
    id : number
    customerName: string,
    amount: number,
    currency: string
    date: string,
    channel: string
    status: string
    failureReason: string
}

export interface ILegacyCustomerResponse{
    customer_Id: number,
    full_name: string
    email: string,
    phone: string,
    status: string,
    created_at: string
    meta: ICustomerMeta
}

interface ICustomerMeta{
    legacy_reference: string
    risk_score: number
    kyc_level: string
    suspension_reason: string | null
}

export interface IModernCustomerResponse{
    id: number
    fullName: string,
    email: string
    phoneNumber: string
    status: string
    date: string
    riskScore: number
    kycLevel: string
    suspensionReason: string | null
}