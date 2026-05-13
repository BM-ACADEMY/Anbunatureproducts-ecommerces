import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const PrivacyPolicy = () => {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="29 July 2025">
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Information We Collect</h2>
        <p className="mb-4">We may collect the following information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name</li>
          <li>Mobile number</li>
          <li>Email address</li>
          <li>Shipping and Billing address</li>
          <li>Payment information</li>
          <li>Device/browser information</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">How We Use Information</h2>
        <p className="mb-4">Customer information may be used for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Order processing and fulfillment</li>
          <li>Customer support and communication</li>
          <li>Delivery updates</li>
          <li>Promotional communication (Marketing)</li>
          <li>Improving website experience</li>
          <li>Fraud prevention</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Payment Security</h2>
        <p className="mb-4">
          We do not store sensitive payment details such as card numbers, CVV, or banking passwords. All payments are processed through secure, PCI-DSS compliant third-party payment gateways.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Data Protection</h2>
        <p>
          We take reasonable physical and technical precautions to protect customer information. However, no online platform can guarantee 100% security.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Marketing Communication</h2>
        <p>
          Customers may receive promotional emails, messages, or offers. You may opt out of these communications at any time by clicking the "unsubscribe" link or contacting us.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Third-Party Services</h2>
        <p>
          We may use third-party services for payment processing, delivery, analytics, and marketing. These providers have their own privacy policies governing how they handle your information.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;
