import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const DisclaimerPage = () => {
  return (
    <PolicyLayout title="Disclaimer" lastUpdated="29 July 2025">
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">General Disclaimer</h2>
        <p className="mb-4">
          The information provided on this website is intended for general wellness and informational purposes only.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Our products are not intended to diagnose, treat, cure, or prevent any disease.</li>
          <li>Results may vary from person to person.</li>
          <li>Customers with allergies, pregnancy concerns, medical conditions, or sensitive skin should consult professionals before use.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Herbal & Natural Product Disclaimer</h2>
        <p className="mb-4">
          Natural and herbal products may react differently depending on individual skin type, body condition, or allergies.
        </p>
        <p className="mb-4">Customers are advised to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Perform patch tests before full use</li>
          <li>Read ingredient details carefully</li>
          <li>Use products responsibly as per instructions</li>
        </ul>
      </section>
    </PolicyLayout>
  );
};

export default DisclaimerPage;
