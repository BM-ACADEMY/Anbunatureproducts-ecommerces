import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Mail, Phone, Instagram } from 'lucide-react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { valideURLConvert } from '../utils/valideURLConvert'; // Import the utility function
import Logo from '../assets/logo.png';

const Footer = () => {
  const date = new Date().getFullYear();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const categoryData = useSelector((state) => state.product.allCategory); // Fetch categories from Redux
  const subCategoryData = useSelector((state) => state.product.allSubCategory); // Fetch subcategories for navigation

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Navigation handler for category clicks removed as we use direct NavLinks or Link with query params now

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
    <footer className="bg-[#163722] text-white font-outfit">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          {/* Column 1: Anbu Natural Contact Info */}
          <div>
            <div className="flex items-center mb-4">
              <img src={Logo} alt="Anbu Natural Logo" className="w-20 h-w-20 mr-2" />
              <h3 className="text-lg font-medium">Anbu Natural</h3>
            </div>
            <p className="mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-white" />
              <a
                href="mailto:anbunaturalproducts@gmail.com"
                className="text-white hover:text-[#1d9a62]"
              >
                anbunaturalproducts@gmail.com
              </a>
            </p>
            <p className="mb-2 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-white" />
              <span className="text-white">7338886850, 9944736850</span>
            </p>
            <p className="flex items-center">
              <Instagram className="w-4 h-4 mr-2 text-white" />
              <a
                href="https://www.instagram.com/anbu_natural_products"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#1d9a62]"
              >
                @anbu_natural_products
              </a>
            </p>
          </div>

          {/* Column 2: Product Categories */}
          <div>
            <h3 className="text-lg font-medium mb-4">Product Categories</h3>
            <ul className="space-y-4">
              {categoryData.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <NavLink
                    to={`/all-products?category=${cat._id}`}
                    className="text-white hover:text-[#1d9a62] text-left"
                  >
                    {cat.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Navigation Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Useful Links</h3>
            <ul className="space-y-4">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? 'underline font-bold' : 'hover:underline hover:text-[#1d9a62]')}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/all-products"
                  className={({ isActive }) => (isActive ? 'underline font-bold' : 'hover:underline hover:text-[#1d9a62]')}
                >
                  Product
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? 'underline font-bold' : 'hover:underline hover:text-[#1d9a62]')}
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => (isActive ? 'underline font-bold' : 'hover:underline hover:text-[#1d9a62]')}
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
                <span className="w-2 h-2 mr-2 rounded-full bg-white"></span>
                <button
                  onClick={handleOpen}
                  className="text-white hover:text-[#1d9a62] text-left"
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
            {/* ... (rest of the modal content remains unchanged) ... */}
          </Typography>
        </Box>
      </Modal>

      {/* Bottom Footer */}
      <div className="py-4">
        <div className="container mx-auto px-4 flex justify-center items-center text-sm text-center">
          &copy; {date}{" "}
          <a
            href="https://bmtechx.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#1d9a62] font-medium mx-1"
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