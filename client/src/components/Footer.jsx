import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Mail, Phone, Instagram, MapPin } from "lucide-react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { valideURLConvert } from "../utils/valideURLConvert"; // Import the utility function
const Logo = "/assets/common/logoheader.png";

const Footer = () => {
  const date = new Date().getFullYear();
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);

  return (
    <footer className="bg-[#163722] text-white font-outfit pt-12">
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          {/* Column 1: Anbu Natural Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src={Logo}
                alt="Anbu Natural Logo"
                className="w-20 h-auto"
              />
            </div>
            <div className="space-y-3">
              <p className="flex items-start text-slate-300 leading-relaxed">
                <MapPin className="w-4 h-4 mr-3 text-green-400 mt-1 shrink-0" />
                <span>30, veerachi south Street, Vellakal, Manaparai Tk, Trichy Dt. Tamilnadu Pin. 621307</span>
              </p>
              <p className="flex items-start">
                <Mail className="w-4 h-4 mr-3 text-green-400 mt-1 shrink-0" />
                <a
                  href="mailto:support@anbunatural.com"
                  className="text-white hover:text-green-400 transition-colors"
                >
                  support@anbunatural.com
                </a>
              </p>
              <p className="flex items-start">
                <Phone className="w-4 h-4 mr-3 text-green-400 mt-1 shrink-0" />
                <span className="text-white">+91 9488549948</span>
              </p>
              <p className="flex items-start">
                <Instagram className="w-4 h-4 mr-3 text-green-400 mt-1 shrink-0" />
                <a
                  href="https://www.instagram.com/anbu_natural_products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-400 transition-colors"
                >
                  @anbu_natural_products
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Product Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-green-800 pb-2 inline-block">Categories</h3>
            <ul className="space-y-3">
              {categoryData.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <NavLink
                    to={`/all-products?category=${cat._id}`}
                    className="text-slate-300 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {cat.name}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to="/all-products" className="text-green-400 font-medium hover:underline">View All Products</NavLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-green-800 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Contact Us", path: "/contact" },
                { name: "Manufacturing", path: "/manufacturing" },
                { name: "Write a Review", path: "/write-review" },
              ].map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `hover:translate-x-1 transition-all inline-block ${isActive ? "text-green-400 font-bold" : "text-slate-300 hover:text-white"}`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-green-800 pb-2 inline-block">Legal & Policies</h3>
            <ul className="space-y-3">
              {[
                { name: "Terms & Conditions", path: "/terms-and-conditions" },
                { name: "Shipping Policy", path: "/shipping-policy" },
                { name: "Return & Refund", path: "/return-refund-policy" },
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Payment Policy", path: "/payment-policy" },
                { name: "Disclaimer", path: "/disclaimer" },
                { name: "Donation Policy", path: "/donation-policy" },
              ].map((policy) => (
                <li key={policy.path}>
                  <NavLink
                    to={policy.path}
                    className={({ isActive }) =>
                      `hover:translate-x-1 transition-all inline-block ${isActive ? "text-green-400 font-bold" : "text-slate-300 hover:text-white"}`
                    }
                  >
                    {policy.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#0f2a1a] py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {date} Anbu Natural. All rights reserved.</p>
          <div className="flex items-center gap-2">
            Built with by 
            <a
              href="https://bmtechx.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-400 font-medium"
            >
              BMTechx.in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
