import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Phone, Instagram } from 'lucide-react';
import { Modal, Box, Typography, Button } from '@mui/material';
import Logo from '../assets/logo.png';

const Footer = () => {
  const date = new Date().getFullYear();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    maxHeight: '80vh',
    bgcolor: 'white',
    border: '1px solid #e5e5e5',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    borderRadius: '8px',
  };

  return (
    <footer className="bg-white text-black font-outfit">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          {/* Column 1: Anbu Natural Contact Info */}
          <div>
            <div className="flex items-center mb-4">
              <img src={Logo} alt="Anbu Natural Logo" className="w-20 h-w-20 mr-2" />
              <h3 className="text-lg font-medium">Anbu Natural</h3>
            </div>
            <p className="mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-600" />
              <a
                href="mailto:anbunaturalproducts@gmail.com"
                className="text-gray-600 hover:text-green-600"
              >
                anbunaturalproducts@gmail.com
              </a>
            </p>
            <p className="mb-2 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-gray-600">7338886850, 9944736850</span>
            </p>
            <p className="flex items-center">
              <Instagram className="w-4 h-4 mr-2 text-gray-600" />
              <a
                href="https://www.instagram.com/anbu_natural_products"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600"
              >
                @anbu_natural_products
              </a>
            </p>
          </div>

          {/* Column 2: Product Categories */}
          <div>
            <h3 className="text-lg font-medium mb-4">Product Categories</h3>
            <ul className="space-y-4">
              <li>Millet Health Mixes</li>
              <li>Herbal Hair Oils</li>
              <li>Baby Care Products</li>
              <li>Women Wellness</li>
              <li>Sanitary Napkins</li>
            </ul>
          </div>

          {/* Column 3: Navigation Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Service Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Our Services</h3>
            <ul className="space-y-4">
              
              <li className="flex items-center">
                <span className="w-2 h-2 mr-2 rounded-full bg-gray-400"></span>
                <button
                  onClick={handleOpen}
                  className="text-gray-600 hover:text-green-600 text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              
            </ul>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="terms-and-conditions-modal"
        aria-describedby="terms-and-conditions-content"
      >
        <Box sx={modalStyle}>
          <Typography
            id="terms-and-conditions-modal"
            variant="h5"
            component="h2"
            className="font-outfit font-medium mb-4"
          >
            Terms & Conditions – Anbu Natural
          </Typography>
          <Typography
            id="terms-and-conditions-content"
            variant="body2"
            className="text-gray-600 font-outfit"
          >
            <strong>Last Updated: 29.7.2025</strong>
            <p className="mt-4">
              Welcome to Anbu Natural. By accessing or using our website
              (www.anbunatural.com), you agree to be bound by the following Terms
              and Conditions. Please read them carefully before using our services.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">1. General</h3>
            <p>
              This website is operated by Anbu Natural, a micro business committed
              to providing herbal, organic, and natural products for health and
              wellness. Added no preservatives or food colors or chemical
              ingredients. By using our website, placing an order, or interacting
              with us, you agree to these Terms and our Privacy Policy.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">2. Products</h3>
            <p>
              All our products are made using natural, herbal, and organic
              ingredients. We do not claim to diagnose, treat, cure, or prevent any
              disease. Always consult a medical professional before using our
              products if you are under medication.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">3. Pricing & Payment</h3>
            <p>
              All prices are listed in Indian Rupees (INR) and are inclusive of
              applicable taxes (unless stated otherwise). We accept payments
              through UPI and other options as shown on the checkout page. Orders
              will be processed only after successful payment confirmation.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">4. Shipping & Delivery</h3>
            <p>
              We aim to dispatch products within 2–5 business days after order
              confirmation. Delivery time may vary depending on your location and
              courier partner. Shipping charges (if any) will be shown at checkout.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">5. Returns & Refunds</h3>
            <p>
              Due to the nature of our products (consumables and personal care), we
              do not accept returns or exchanges unless the product is damaged or
              incorrect. If your order is damaged or wrong, please contact us
              within 48 hours of delivery with a photo for verification. Refunds
              will be processed within 7–10 working days after approval.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">6. Cancellations</h3>
            <p>
              Orders once placed cannot be cancelled after dispatch. If you wish to
              cancel, contact us within 6 hours of order placement.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">7. Use of Content</h3>
            <p>
              All images, logos, product descriptions, and content on this website
              are the property of Anbu Natural. You may not reproduce, distribute,
              or use our content without written permission.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">8. Privacy</h3>
            <p>
              We respect your privacy and do not share your personal information
              with third parties except for delivery or payment processing. For
              full details, please read our Privacy Policy.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">9. Limitation of Liability</h3>
            <p>
              We are not responsible for any adverse reaction caused due to
              individual skin, body, or health conditions. Our liability is
              limited to the value of the product purchased.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-2">10. Governing Law</h3>
            <p>
              These Terms shall be governed by the laws of India. Any disputes will
              be subject to the jurisdiction of Tamil Nadu courts.
            </p>
          </Typography>
          
        </Box>
      </Modal>

      {/* Bottom Footer */}
      <div className="border-t bg-white py-4">
  <div className="container mx-auto px-4 flex justify-center items-center text-sm text-center">
    &copy; {date}{" "}
    <a
      href="https://bmtechx.in"
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-600 hover:underline mx-1"
    >
      BMTechx.in
    </a>
    All rights reserved.
  </div>
</div>
    </footer>
  );
};

export default Footer;