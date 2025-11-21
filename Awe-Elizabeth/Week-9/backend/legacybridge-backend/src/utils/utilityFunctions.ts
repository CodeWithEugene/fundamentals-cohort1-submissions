import { ILegacyCustomerResponse, ILegacyPaymentRespose, IModernCustomerResponse, IModernPaymentResponse } from "./intefaces";

export const transformPaymentData = (data: ILegacyPaymentRespose): IModernPaymentResponse => {
  return {
    id: data.payment_id,
    customerName: data.customer_name,
    amount: Number(data.amount),
    date: new Date(data.created_at).toISOString(),
    status: data.status,
    channel: data.channel.toLowerCase(),
    currency: data.currency,
    failureReason: data.meta.failure_reason? data.meta.failure_reason : ""
  };
}

export const transformCustomerData = (data: ILegacyCustomerResponse): IModernCustomerResponse => {
  return {
    id: data.customer_Id,
    fullName: data.full_name,
    email: data.email,
    phoneNumber: data.phone,
    //new Date(legacy.replace(" ", "T") + "Z").toISOString();
    date: new Date(data.created_at).toISOString(),
    status: data.status,
    riskScore: data.meta.risk_score,
    kycLevel: data.meta.kyc_level,
    suspensionReason: data.meta.suspension_reason
  };
}