import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const ReturnRefundPolicy = () => {
  return (
    <PolicyLayout title="Return & Refund Policy" lastUpdated="29 July 2025">
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Return Eligibility</h2>
        <p className="mb-4">Returns are accepted only under the following conditions:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Wrong product delivered</li>
          <li>Damaged product received</li>
          <li>Product leakage during transit</li>
          <li>Expired product delivered</li>
          <li>Missing item in package</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Non-Returnable Items</h2>
        <p className="mb-4">For hygiene and safety reasons, the following items are generally non-returnable:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Opened herbal products</li>
          <li>Used skincare products</li>
          <li>Opened food products</li>
          <li>Opened wellness powders</li>
          <li>Products damaged after delivery due to customer handling</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Return Request Timeline</h2>
        <p className="mb-4">Customers must contact us within:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>24 hours</strong> for damaged or incorrect items</li>
          <li><strong>24 hours</strong> for missing items</li>
        </ul>
        <p className="mt-4 italic text-slate-500">Requests raised after the allowed period may not be eligible.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Proof Required</h2>
        <p className="mb-4">To process returns or refunds, customers may be required to provide:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Order number</li>
          <li>Photos of package and product</li>
          <li>Unboxing video (highly recommended)</li>
          <li>Description of the issue</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Refund Process</h2>
        <p className="mb-4">Approved refunds will be processed through the original payment method or bank transfer.</p>
        <p className="mb-4"><strong>Refund timelines:</strong></p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>UPI/Wallets:</strong> 2–5 business days</li>
          <li><strong>Bank transfer:</strong> 5–7 business days</li>
          <li><strong>Credit/Debit cards:</strong> Depends on bank processing time</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Cancellation Policy</h2>
        <p className="mb-4">Orders may be cancelled before shipping confirmation or dispatch from the warehouse.</p>
        <p className="font-medium text-slate-800 italic">* Once shipped, cancellation requests may not be possible.</p>
      </section>
    </PolicyLayout>
  );
};

export default ReturnRefundPolicy;
