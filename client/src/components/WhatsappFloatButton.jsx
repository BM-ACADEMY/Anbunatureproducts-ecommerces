import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import whatsappIcon from "../assets/whatsapp.png";
import { ArrowUp } from "lucide-react";

const WhatsappFloatButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    <>
      {/* Scroll to Top Button (with bounce + fade in when scrolling down) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scrollTop"
            onClick={handleScrollTop}
            className="fixed bottom-20 right-6 z-50 bg-[rgb(37,172,113)] text-white p-3 rounded-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300 }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 12px rgb(37,172,113)",
            }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.a
        href={`https://wa.me/9952787198?text=${encodeURIComponent(
          "Hello, Anbu Natural Products"
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50"
        whileHover={{
          scale: 1.1,
          boxShadow: "0px 0px 12px rgba(37, 211, 102, 0.9)",
        }}
        style={{
          display: "inline-block",
          borderRadius: "50%",
          transition: "box-shadow 0.3s ease-in-out",
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img
          src={whatsappIcon}
          alt="WhatsApp"
          className="w-12 h-12 object-contain"
        />
      </motion.a>
    </>
  );
};

export default WhatsappFloatButton;
