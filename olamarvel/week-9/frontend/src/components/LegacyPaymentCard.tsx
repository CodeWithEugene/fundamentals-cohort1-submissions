import type { LegacyPayment } from '@/type';
import React from 'react';



interface LegacyPaymentCardProps {
    payment: LegacyPayment;
}

const LegacyPaymentCard: React.FC<LegacyPaymentCardProps> = ({ payment }) => {
    const payId = payment.pay_id || 'N/A';
    const amountCents = payment.amt_cents !== undefined ? payment.amt_cents : 'N/A';
    const customerId = payment.cust?.id || payment.customer_id || 'N/A';
    const customerName = payment.cust?.fullname || 'N/A';
    const amount = payment.amount || 'N/A';
    const transactionTimestamp = payment.timestamp ? new Date(payment.timestamp).toLocaleString() : 'N/A';
    const transactionTime = payment.time ? new Date(payment.time).toLocaleString() : 'N/A';

    return (
        <div className="border border-gray-300 rounded-lg p-4 m-4 shadow-md bg-white max-w-xs">
            <h3 className="text-lg font-semibold mb-2">Legacy Payment Details</h3>
            <p className="text-sm text-gray-700"><strong>Payment ID:</strong> {payId}</p>
            <p className="text-sm text-gray-700"><strong>Amount (Cents):</strong> {amountCents}</p>
            <p className="text-sm text-gray-700"><strong>Amount:</strong> {amount}</p>
            <p className="text-sm text-gray-700"><strong>Customer ID:</strong> {customerId}</p>
            <p className="text-sm text-gray-700"><strong>Customer Name:</strong> {customerName}</p>
            <p className="text-sm text-gray-700"><strong>Timestamp:</strong> {transactionTimestamp}</p>
            <p className="text-sm text-gray-700"><strong>Time (Deprecated):</strong> {transactionTime}</p>
        </div>
    );
};

export default LegacyPaymentCard;
