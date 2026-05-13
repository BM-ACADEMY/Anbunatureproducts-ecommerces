import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const DonationPolicy = () => {
  return (
    <PolicyLayout title="Donation Policy (Anbu Care)" lastUpdated="29 July 2025">
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">About Donations</h2>
        <p className="mb-4">
          Voluntary donations collected through Anbu Natural or Anbu Care initiatives are used to support our community wellness programs.
        </p>
        <p className="mb-4">Funds may be used for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Child wellness support</li>
          <li>Women wellness awareness</li>
          <li>Community welfare activities</li>
          <li>Nutrition awareness programs</li>
          <li>Social support initiatives</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Voluntary Contributions</h2>
        <p>
          All donations are completely voluntary. Customers are not obligated to contribute while placing orders. Any donation made is non-refundable as it is immediately allocated to social welfare activities.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Donation Usage</h2>
        <p>
          Funds collected are utilized based on current community needs and social initiatives managed by Anbu Care. We strive for full transparency in our welfare activities.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default DonationPolicy;
