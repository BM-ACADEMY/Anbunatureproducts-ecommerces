import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ finishLoading }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      finishLoading();
    }, 2800); // Slightly longer for a more premium feel
    return () => clearTimeout(timer);
  }, [finishLoading]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#fcf8ed]"
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Background Decorative Elements */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 2, opacity: 0.15 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-64 h-64 rounded-full border border-green-200"
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 2.5, opacity: 0.1 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
          className="absolute w-64 h-64 rounded-full border border-emerald-100"
        />

        {/* Main Logo & Text */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="relative mb-8">
            <motion.div
               animate={{ 
                 rotate: 360 
               }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-4"
            />
            <motion.img
              src="/assets/common/logo.webp"
              alt="Anbu Natural"
              className="h-28 md:h-36 w-auto relative z-20"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  ease: "easeInOut" 
              }}
            />
          </div>
          
        </motion.div>

        {/* Elegant Progress Line */}
        <div className=" w-40 h-[1.5px] bg-green-900/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }}
            className="w-full h-full bg-green-700"
          />
        </div>

        {/* Loading Text */}
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
        >
            Loading...
        </motion.span>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
