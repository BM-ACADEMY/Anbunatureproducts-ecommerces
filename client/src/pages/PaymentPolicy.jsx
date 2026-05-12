import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const PaymentPolicy = () => {
  return (
    <PolicyLayout title="Payment Policy" lastUpdated="29 July 2025">
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Accepted Payment Methods</h2>
        <p className="mb-4">We currently accept or plan to accept the following payment methods:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>UPI (Direct)</li>
          <li>Debit & Credit Cards (Coming soon)</li>
          <li>Net Banking (Coming soon)</li>
          <li>Wallets (Coming soon)</li>
          <li>Cash on Delivery (Available for select locations)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Failed Transactions</h2>
        <p className="mb-4">If your payment is deducted but the order is not confirmed:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Please wait 24 hours for the transaction status to update.</li>
          <li>Contact our support team with transaction details.</li>
          <li>Refunds for failed transactions usually happen automatically through your bank or payment provider.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Cash on Delivery (COD)</h2>
        <p className="mb-4">COD may not be available for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Certain remote locations</li>
          <li>High-value orders</li>
          <li>Promotional periods</li>
        </ul>
        <p className="mt-4 italic text-sm">
          * Repeated fake or rejected COD orders may result in account restrictions.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default PaymentPolicy;
