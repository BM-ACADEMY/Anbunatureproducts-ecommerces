import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const TermsAndConditions = () => {
  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated="29 July 2025">
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Welcome to Anbu Natural</h2>
        <p className="mb-4">
          By accessing or using our website, products, services, or placing an order through our website, you agree to comply with and be bound by the following Terms & Conditions.
        </p>
        <p className="mb-4">
          Please read these terms carefully before using our services. If you do not agree with any part of these terms, please do not use our website.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">About Us</h2>
        <p>
          Anbu Natural is a natural wellness and herbal products brand focused on providing traditional, herbal, and family wellness products.
          <br />
          <strong>Registered Website:</strong> www.anbunatural.com
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Eligibility</h2>
        <p className="mb-4">By using this website, you confirm that:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are at least 18 years old or using the website under parental supervision.</li>
          <li>The information provided by you is accurate and complete.</li>
          <li>You will use the website only for lawful purposes.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Product Information</h2>
        <p className="mb-4">We strive to provide accurate product descriptions, images, ingredients, and pricing. However:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Product colors may slightly vary due to lighting and screen settings.</li>
          <li>Herbal and natural products may have slight variations in texture, aroma, or color.</li>
          <li>Product packaging may change without prior notice.</li>
          <li>Information provided on this website is for general wellness purposes only.</li>
          <li>Anbu Natural does not guarantee medical cures, treatments, or disease prevention.</li>
          <li>Customers are advised to consult healthcare professionals for medical concerns.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Pricing</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>All prices displayed are in Indian Rupees (INR).</li>
          <li>Prices may change without prior notice.</li>
          <li>Shipping charges, taxes, or additional fees may apply depending on the order.</li>
          <li>We reserve the right to correct pricing errors at any time.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Orders & Acceptance</h2>
        <p className="mb-4">Placing an order does not guarantee acceptance. Anbu Natural reserves the right to cancel or refuse any order.</p>
        <p className="mb-4">Orders may be cancelled due to: Product unavailability, incorrect pricing, suspected fraudulent activity, delivery limitations, or payment issues.</p>
        <p>If payment has already been made, the eligible amount will be refunded.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Coupon Codes & Promotional Offers</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Coupon codes are subject to validity periods and conditions.</li>
          <li>Only one coupon may be used per order unless stated otherwise.</li>
          <li>Offers may be modified or withdrawn at any time.</li>
          <li>Free gifts and promotional products are subject to availability.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">User Responsibilities</h2>
        <p className="mb-4">Users agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the website for illegal purposes</li>
          <li>Attempt to damage or hack the website</li>
          <li>Upload harmful software or malicious code</li>
          <li>Submit false information</li>
          <li>Misuse offers or promotional codes</li>
          <li>Copy website content without permission</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Intellectual Property</h2>
        <p>
          All content on this website including logos, images, product names, graphics, text, designs, videos, and branding are the property of Anbu Natural and may not be copied, reproduced, or used without written permission.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Limitation of Liability</h2>
        <p className="mb-4">Anbu Natural shall not be held responsible for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Allergic reactions</li>
          <li>Improper product usage</li>
          <li>Delayed deliveries caused by courier services</li>
          <li>Losses due to incorrect address provided by customer</li>
          <li>Technical website interruptions</li>
          <li>Indirect or consequential damages</li>
        </ul>
        <p className="mt-4 font-medium text-slate-800">Customers are encouraged to perform patch tests before using herbal or skincare products.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">External Links</h2>
        <p>
          Our website may contain links to third-party websites or payment gateways. We are not responsible for the content, privacy practices, or policies of external websites.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Modifications</h2>
        <p>
          Anbu Natural reserves the right to update or modify these Terms & Conditions at any time without prior notice. Continued use of the website after changes indicates acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Governing Law</h2>
        <p>
          These Terms & Conditions shall be governed by the laws of India. Any disputes arising shall be subject to the jurisdiction of the courts in Tamil Nadu, India.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default TermsAndConditions;
