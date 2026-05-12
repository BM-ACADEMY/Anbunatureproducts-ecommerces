import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const whatsappIcon = "/assets/common/whatsapp.webp";
import { ArrowUp, PhoneCall } from "lucide-react";

const WhatsappFloatButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const phoneNumber = "7338886850"; // Corrected number from user data

  // Show the scroll-to-top button after scrolling 200px
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-4 items-center">
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scrollTop"
            onClick={handleScrollTop}
            className="bg-white text-[#163722] p-3 rounded-full shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.1 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Call Button */}
      <motion.a
        href={`tel:+91${phoneNumber}`}
        className="bg-blue-600 text-white p-3.5 rounded-full shadow-lg flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0px 0px 15px rgba(37, 99, 235, 0.6)",
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <PhoneCall className="w-5 h-5" />
      </motion.a>

      {/* WhatsApp Button */}
      <motion.a
        href={`https://wa.me/91${phoneNumber}?text=${encodeURIComponent(
          "Hello, Anbu Natural. I'm interested in your products."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{
          scale: 1.1,
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img
          src={whatsappIcon}
          alt="WhatsApp"
          className="w-12 h-12 object-contain drop-shadow-md"
        />
      </motion.a>
    </div>
  );
};

export default WhatsappFloatButton;
