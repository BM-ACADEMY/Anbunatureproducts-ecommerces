import React from "react";
import { NavLink } from "react-router-dom";
import { Mail, Phone, Instagram, MapPin } from "lucide-react";

const Logo = "/assets/common/logoheader.png";

const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <footer className="bg-[#163722] text-white font-outfit pt-12">
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          {/* Column 1: About & Logo */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center pb-2">
                <img
                  src={Logo}
                  alt="Anbu Natural Logo"
                  className="w-24 h-auto  p-2 rounded-lg backdrop-blur-sm"
                />
              </div>
              <p className="text-slate-300 leading-relaxed">
                Anbu Natural Products is dedicated to providing high-quality, pure, and natural products that promote a healthy and sustainable lifestyle. We believe in the power of nature to nourish and heal.
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 inline-block uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Contact Us", path: "/contact" },
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

          {/* Column 3: Legal & Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 inline-block uppercase tracking-wider">Legal & Policies</h3>
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

          {/* Column 4: Contact Details */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 inline-block uppercase tracking-wider">Contact Details</h3>
            <div className="space-y-4">
              <p className="flex items-start text-slate-300 leading-relaxed group">
                <MapPin className="w-5 h-5 mr-3 text-green-400 mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                <span>30, veerachi south Street, Vellakal, Manaparai Tk, Trichy Dt. Tamilnadu Pin. 621307</span>
              </p>
              <p className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-green-400 shrink-0" />
                <a
                  href="mailto:anbunaturalproducts@gmail.com"
                  className="text-white hover:text-green-400 transition-colors"
                >
                  anbunaturalproducts@gmail.com
                </a>
              </p>
              <p className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-green-400 shrink-0" />
                <span className="text-white">+91 9488549948</span>
              </p>
              <p className="flex items-center">
                <Instagram className="w-5 h-5 mr-3 text-green-400 shrink-0" />
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
