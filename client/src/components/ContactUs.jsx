import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '', // Changed from 'name' to match backend
    email: '',
    contactNumber: '', // Changed from 'phone' to match backend
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }

      setSuccess('Your message has been sent successfully!');
      setFormData({ fullName: '', email: '', contactNumber: '', message: '' });
    } catch (err) {
      console.error('Fetch error:', {
        message: err.message,
        status: err.response?.status,
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fafafa] font-outfit py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-left"> {/* Added container for left alignment */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Drop Us a Line</h2>
          <p className="text-gray-600 mb-6">
            Your email address will not be published. Required fields are marked *
          </p>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="text-left">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter Your Name *"
                  required
                  className="w-full p-3 border border-gray-300 rounded-none text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {/* Email Field */}
              <div className="text-left">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email Address *"
                  required
                  className="w-full p-3 border border-gray-300 rounded-none text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {/* Phone Field */}
              <div className="text-left">
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="w-full p-3 border border-gray-300 rounded-none text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="text-left">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter Your Message here *"
                rows="6"
                required
                className="w-full p-3 border border-gray-300 rounded-none text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-left">
              <button
                type="submit"
                disabled={loading}
                className={`bg-black text-white px-6 py-3 uppercase font-semibold tracking-wider hover:bg-gray-800 transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Sending...' : 'Post a Comment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;