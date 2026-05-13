import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const ShippingPolicy = () => {
  return (
    <PolicyLayout title="Shipping Policy" lastUpdated="29 July 2025">
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Order Processing</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Orders are usually processed within 1–3 business days.</li>
          <li>Orders placed on Sundays or public holidays may be processed on the next working day.</li>
          <li>During festivals, sales, or high-demand periods, processing times may be slightly delayed.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Shipping Charges</h2>
        <p className="mb-4">Shipping charges are calculated based on:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Order value</li>
          <li>Product weight</li>
          <li>Delivery location</li>
          <li>Ongoing promotional offers</li>
        </ul>
        <p className="mt-4">Free shipping may be available on selected orders or above a minimum purchase value.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Delivery Timeline</h2>
        <p className="mb-4">Estimated delivery times:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Tamil Nadu:</strong> 2–5 business days</li>
          <li><strong>South India:</strong> 3–7 business days</li>
          <li><strong>Other Indian States:</strong> 4–10 business days</li>
        </ul>
        <p className="mt-4 text-sm italic text-slate-500">
          * Delivery timelines are estimates and may vary due to weather conditions, courier delays, remote locations, public holidays, or natural events.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Incorrect Address</h2>
        <p className="mb-4">Customers are responsible for providing accurate delivery details. Anbu Natural will not be responsible for delivery failures due to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Incorrect address</li>
          <li>Wrong mobile number</li>
          <li>Customer unavailability</li>
        </ul>
        <p className="mt-4">Additional shipping charges may apply for re-dispatch.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Delivery Delays</h2>
        <p>
          While we work hard to deliver orders on time, unexpected courier or logistics delays may occur. Anbu Natural is not liable for delays caused by third-party courier services. However, we will provide reasonable support to help track and resolve delivery concerns.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Damaged Package During Delivery</h2>
        <p className="mb-4">If your package appears visibly damaged:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Take photos before opening</li>
          <li>Record an unpacking video if possible</li>
          <li>Contact us within 24 hours of delivery</li>
        </ul>
        <p className="mt-4">Claims raised after prolonged usage or after several days may not be accepted.</p>
      </section>
    </PolicyLayout>
  );
};

export default ShippingPolicy;
