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

  // Navigation handler for category clicks
  const handleRedirectProductListpage = (id, cat) => {
    if (!subCategoryData || subCategoryData.length === 0) {
      console.warn("Subcategory data not available yet.");
      const url = `/${valideURLConvert(cat)}-${id}`;
      navigate(url);
      return;
    }

    const subcategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id === id)
    );

    if (subcategory) {
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
        subcategory.name
      )}-${subcategory._id}`;
      navigate(url);
    } else {
      const url = `/${valideURLConvert(cat)}-${id}`;
      navigate(url);
      console.warn(
        `No specific subcategory found for category ID: ${id}. Navigating to general category page.`
      );
    }
  };

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
              {categoryData.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <button
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                    className="text-gray-600 hover:text-green-600 text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
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
            {/* ... (rest of the modal content remains unchanged) ... */}
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